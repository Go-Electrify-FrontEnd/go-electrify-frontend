// Lightweight wrappers around Next.js' navigation APIs

import { createNavigation } from "next-intl/navigation";
import { routing } from "./routing";

// that will consider the routing configuration
export const { Link, redirect, usePathname, useRouter, getPathname } =
  createNavigation(routing);
