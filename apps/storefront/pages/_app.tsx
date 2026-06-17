import "../components/plasmic/blank_project/plasmic.css"; // plasmic-import: 3RVpz8tf8oHM2jiuGYHU8J/projectcss
// Pages Router entry, used ONLY for Plasmic codegen pages. The Medusa
// storefront itself runs on the App Router (src/app). Global Plasmic CSS must
// be imported here because Next.js only allows global CSS imports in _app.
import "../components/plasmic/plasmic__default_style.css";
import type { AppProps } from "next/app";
export default function PlasmicApp({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
