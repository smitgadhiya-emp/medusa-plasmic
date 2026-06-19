"use client";

import * as React from "react";
import {
  PlasmicNewPage,
  DefaultNewPageProps
} from "../../../components/plasmic/test/PlasmicNewPage"; // plasmic-import: 1bNVCmIO7HeA/render

export function ClientNewPage(props: DefaultNewPageProps) {
  return <PlasmicNewPage {...props} />;
}
