"use client";

import dynamic from "next/dynamic";

const ComponentNoSSR = dynamic(() => import("./join-page-wrapper"), {
  ssr: false,
});

export default async function JoinPage() {
  return <ComponentNoSSR />;
}
