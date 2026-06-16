import { PlasmicComponent } from "@plasmicapp/loader-nextjs"
import { notFound } from "next/navigation"

import { PLASMIC } from "../../../plasmic-init"
import { PlasmicClientRootProvider } from "../../../plasmic-init-client"

export const dynamic = "force-dynamic"

// Demo route: explicitly renders the Plasmic Studio page at path "/" (your
// "Homepage"), which is otherwise shadowed by the Medusa storefront homepage.
// Visit /<countryCode>/plasmic-home (e.g. /dk/plasmic-home) to see it.
export default async function PlasmicHomeDemo() {
  const plasmicData = await PLASMIC.maybeFetchComponentData("/")

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
