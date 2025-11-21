"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";

const AppSidebar = dynamic(
  () => import("./app-sidebar").then((mod) => mod.AppSidebar),
  { ssr: false },
);

export function AppSidebarWrapper(props: ComponentProps<typeof AppSidebar>) {
  return <AppSidebar {...props} />;
}
