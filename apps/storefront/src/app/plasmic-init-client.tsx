"use client"

import { PlasmicRootProvider } from "@plasmicapp/loader-nextjs"
import Link from "next/link"
import * as React from "react"

import { PLASMIC } from "./plasmic-init"

// PlasmicRootProvider must run on the client, so it lives in its own
// "use client" module. Server components (the catch-all page) import this
// wrapper and pass the prefetched data down.
export function PlasmicClientRootProvider(
  props: Omit<React.ComponentProps<typeof PlasmicRootProvider>, "loader">
) {
  return <PlasmicRootProvider loader={PLASMIC} Link={Link as any} {...props} />
}
