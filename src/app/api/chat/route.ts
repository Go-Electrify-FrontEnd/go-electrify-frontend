import {
  convertToModelMessages,
  stepCountIs,
  streamText,
  tool,
  type UIMessage,
} from "ai";
import { gateway } from "@ai-sdk/gateway";
import { z } from "zod";
import { searchSimilarChunks } from "@/features/rag/services/vector-operations";
import type { RetrievedChunk } from "@/features/rag/types";
import { getUser } from "@/lib/auth/auth-server";
import { forbidden } from "next/navigation";

export const maxDuration = 30;

const systemPrompt = `You are Go-Electrify's EV charging assistant.

Call getInformation only for factual queries (pricing, policies, specs, troubleshooting). For general chat, respond directly.

Key rules:
- Use getUserInfo for personalization (name, role)
- Cite sources as [Source: documentName#chunkIndex]
- Match user language, preserve Go-Electrify product names
- Tailor depth: technical for admins, simple for drivers
- Never guess about Go-Electrify services

If no info found, say: "I don't have that info, please contact support" in user's language.`;

export async function POST(req: Request) {
  const { user } = await getUser();
  if (!user) {
    forbidden();
  }

  if (
    user.role.toLowerCase() !== "admin" ||
    user.email !== "phungthequan030@gmail.com"
  ) {
    forbidden();
  }

  const { messages } = await req.json();
  const result = streamText({
    model: gateway("anthropic/claude-haiku-4.5"),
    messages: convertToModelMessages(messages),
    system: systemPrompt,
    stopWhen: stepCountIs(5),
    tools: {
      getUserInfo: tool({
        description: "Get user info (name, email, role) for personalization.",
        inputSchema: z.object({}),
        execute: async () => {
          return {
            name: user.name || "User",
            email: user.email,
            role: user.role,
            userId: user.uid,
          };
        },
      }),
      getInformation: tool({
        description: "Search Go-Electrify knowledge base.",
        inputSchema: z.object({
          question: z.string().describe("User question"),
          similarQuestions: z
            .array(z.string())
            .describe("Search keywords/questions")
            .optional(),
        }),
        execute: async ({ question, similarQuestions }) => {
          const allTerms = [...(similarQuestions || []), question];

          const normalizedTerms = allTerms
            .map((term) => term.trim())
            .filter(Boolean);

          // Remove duplicates and limit to 6 terms
          const uniqueTerms = Array.from(new Set(normalizedTerms));
          const searchTerms = uniqueTerms.slice(0, 6);

          // Search all terms in parallel
          const results = await Promise.allSettled(
            searchTerms.map((term) => searchSimilarChunks(term, 6, 0.6)),
          );

          const chunkMap = new Map<string, RetrievedChunk>();
          for (const result of results) {
            if (result.status !== "fulfilled") continue;
            for (const chunk of result.value) {
              const key = `${chunk.metadata?.documentName ?? chunk.source}-${chunk.metadata?.chunkIndex ?? "unknown"}`;
              const existing = chunkMap.get(key);
              if (!existing || (chunk.score ?? 0) > (existing.score ?? 0)) {
                chunkMap.set(key, chunk);
              }
            }
          }

          // Sort by score and get top 12
          const topChunks = Array.from(chunkMap.values())
            .sort((a, b) => (b.score ?? 0) - (a.score ?? 0))
            .slice(0, 12);

          if (topChunks.length === 0) {
            console.warn("No relevant documents found for terms:", searchTerms);
          }

          // Format response
          return topChunks.map((chunk, index) => ({
            id: index + 1,
            content: chunk.content,
            documentName: chunk.metadata?.documentName ?? chunk.source,
            documentType: chunk.metadata?.documentType ?? "unknown",
            chunkIndex: chunk.metadata?.chunkIndex ?? null,
            confidence: chunk.score,
          }));
        },
      }),
    },
    onFinish: async ({ usage, text }) => {
      console.log(
        `\n=== Chat Response Complete ===\nInput Tokens: ${usage.inputTokens}\nOutput Tokens: ${usage.outputTokens}\nTotal Tokens: ${usage.totalTokens}\nResponse Length: ${text.length} chars\n============================\n`,
      );
    },
  });

  return result.toUIMessageStreamResponse();
}
