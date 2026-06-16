import { initPlasmicLoader } from "@plasmicapp/loader-nextjs/react-server-conditional"

// Headless / loader integration for the App Router.
// The project id + public API token come from the project you synced in
// Plasmic Studio. The token is a read-only "project API token" and is safe to
// ship to the client. Add more entries to `projects` to render multiple
// Plasmic projects.
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "3RVpz8tf8oHM2jiuGYHU8J",
      token:
        "oIx4DF9fXTxFOFpb44MLM3sqgS4aFruu4zSOtqmedwDJ468Vew80ByiqvFwYHRFLYr0dD8SUauwx7A4GfgQ",
    },
  ],
  // Set to true to fetch unpublished changes from Studio (useful while editing).
  preview: false,
})
