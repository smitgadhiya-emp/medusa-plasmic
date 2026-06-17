"use client";

import * as React from "react";
import {
  PlasmicHelloTest,
  DefaultHelloTestProps
} from "../../../components/plasmic/test/PlasmicHelloTest"; // plasmic-import: C8KO1p_P0FD2/render

export function ClientHelloTest(props: DefaultHelloTestProps) {
  return <PlasmicHelloTest {...props} />;
}
