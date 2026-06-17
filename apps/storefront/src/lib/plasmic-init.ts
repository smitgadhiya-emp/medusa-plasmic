import { initPlasmicLoader } from "@plasmicapp/loader-nextjs"

import PromoBadge from "@modules/common/components/promo-badge"
import LoginForm from "@modules/account/components/auth-card/login-form"

// Pages/designs are handled by codegen (`plasmic sync`). This loader instance is
// used ONLY to register your hand-written code components for Studio's
// drag-and-drop and to power the /plasmic-host page — it never renders Plasmic
// pages, so it does NOT require publishing.
export const PLASMIC = initPlasmicLoader({
  projects: [
    {
      id: "3RVpz8tf8oHM2jiuGYHU8J",
      token:
        "oIx4DF9fXTxFOFpb44MLM3sqgS4aFruu4zSOtqmedwDJ468Vew80ByiqvFwYHRFLYr0dD8SUauwx7A4GfgQ",
    },
  ],
})

// ── Register every code component you want in Studio's insert panel. ──
// Add one PLASMIC.registerComponent() block per component (same meta shape as
// your other project: name, displayName, importPath, props).
PLASMIC.registerComponent(PromoBadge, {
  name: "PromoBadge",
  displayName: "Promo Badge",
  importPath: "@modules/common/components/promo-badge",
  props: {
    text: {
      type: "string",
      defaultValue: "NEW",
    },
    color: {
      type: "color",
      defaultValue: "#db2777",
    },
  },
})


PLASMIC.registerComponent(LoginForm, {
  name: "LoginForm",
  displayName: "Login Form",
  importPath: "@modules/account/components/auth-card/login-form",
  props: {
    title: {
      type: "string",
      defaultValue: "Welcome Back",
    },
    emailPlaceholder: {
      type: "string",
      defaultValue: "E-mail",
    },
    passwordPlaceholder: {
      type: "string",
      defaultValue: "Password",
    },
    forgotLabel: {
      type: "string",
      defaultValue: "Forgot your password??",
    },
    submitLabel: {
      type: "string",
      defaultValue: "Login",
    },
    registerPrompt: {
      type: "string",
      defaultValue: "Don't have an account?",
    },
    registerLabel: {
      type: "string",
      defaultValue: "Create Account",
    },
    onLogin: {
      type: "eventHandler",
      argTypes: [{ name: "values", type: "object" }],
    },
    onForgot: {
      type: "eventHandler",
      argTypes: [],
    },
    onRegister: {
      type: "eventHandler",
      argTypes: [],
    },
  },
})


