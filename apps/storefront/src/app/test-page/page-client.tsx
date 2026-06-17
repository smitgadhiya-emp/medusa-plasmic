"use client";

import * as React from "react";
import {
  PlasmicTestPage,
  DefaultTestPageProps
} from "../../../components/plasmic/test/PlasmicTestPage"; // plasmic-import: yuEVZhguQr97/render

export function ClientTestPage(props: DefaultTestPageProps) {
  return <PlasmicTestPage {...props} />;
}
