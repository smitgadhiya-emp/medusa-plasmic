import { PlasmicComponent } from "@plasmicapp/loader-nextjs"
import { notFound } from "next/navigation"

import { PLASMIC } from "../../../plasmic-init"
import { PlasmicClientRootProvider } from "../../../plasmic-init-client"

export const dynamic = "force-dynamic"

// Renders any Plasmic Studio page whose path is NOT already owned by a Medusa
// route. URLs are country-prefixed (e.g. a Studio page at "/landing" is served
// at "/<countryCode>/landing"), so we strip the countryCode and look the page
// up by the remaining path. The Medusa homepage at "/<countryCode>" is handled
// by the existing (main)/page.tsx — this catch-all only matches sub-paths.
export default async function PlasmicLoaderPage({
  params,
}: {
  params: Promise<{ countryCode: string; plasmicCatchall?: string[] }>
}) {
  const { plasmicCatchall } = await params
  const plasmicPath = "/" + (plasmicCatchall?.join("/") ?? "")

  const plasmicData = await PLASMIC.maybeFetchComponentData(plasmicPath)

  if (!plasmicData || plasmicData.entryCompMetas.length === 0) {
    notFound()
  }

  const pageMeta = plasmicData.entryCompMetas[0]

  return (
    <PlasmicClientRootProvider
      prefetchedData={plasmicData}
      pageRoute={pageMeta.path}
      pageParams={pageMeta.params}
    >
      <PlasmicComponent component={pageMeta.displayName ?? pageMeta.name} />
    </PlasmicClientRootProvider>
  )
}
