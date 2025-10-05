import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/shared/theme-provider";
import { Toaster } from "sonner";
import { UserProvider } from "@/contexts/user-context";
import { cookies } from "next/headers";
import * as jose from "jose";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin", "latin-ext"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "latin-ext"],
});

export const metadata: Metadata = {
  title: "Electrify",
  description: "A tool to help you find electric vehicle incentives.",
};

import type { User } from "@/types";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value || null;
  const secret = new TextEncoder().encode(process.env.AUTH_SECRET_KEY);
  let user: User | null = null;

  if (accessToken != null) {
    const { payload, protectedHeader } = await jose.jwtVerify(
      accessToken,
      secret,
    );

    console.log(JSON.stringify(payload, null, 2));
    console.log(JSON.stringify(protectedHeader, null, 2));
    user = { email: payload.email as string };
  }

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <UserProvider user={user}>{children}</UserProvider>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
