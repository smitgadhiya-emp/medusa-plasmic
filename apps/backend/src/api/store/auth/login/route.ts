import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  generateJwtToken,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { z } from "zod"

// POST /store/auth/login
// Authenticates a customer with email + password and returns a JWT token.
// This mirrors Medusa's built-in POST /auth/customer/emailpass, exposed under
// /store so the storefront can reach it with just the publishable API key.

export const PostStoreAuthLoginSchema = z.object({
  email: z.email(),
  password: z.string().min(1),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, password } = PostStoreAuthLoginSchema.parse(req.body)

  const config = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
  const authModule = req.scope.resolve(Modules.AUTH)

  // Hand the credentials to the emailpass provider for the "customer" actor.
  const { success, authIdentity, error } = await authModule.authenticate(
    "emailpass",
    {
      actor_type: "customer",
      url: req.url,
      headers: req.headers as Record<string, string>,
      query: req.query as Record<string, string>,
      body: { email, password },
      protocol: req.protocol,
    }
  )

  if (!success || !authIdentity) {
    throw new MedusaError(
      MedusaError.Types.UNAUTHORIZED,
      error || "Invalid email or password"
    )
  }

  // Mint a JWT carrying the resolved customer id (same shape Medusa core uses).
  const { http } = config.projectConfig
  const customerId = authIdentity.app_metadata?.customer_id

  const token = generateJwtToken(
    {
      actor_id: (customerId as string) ?? "",
      actor_type: "customer",
      auth_identity_id: authIdentity.id ?? "",
      auth_provider: "emailpass",
      app_metadata: {
        ...(authIdentity.app_metadata ?? {}),
        customer_id: customerId,
      },
    },
    {
      secret: http.jwtSecret,
      expiresIn: http.jwtExpiresIn,
      jwtOptions: http.jwtOptions,
    }
  )

  return res.status(200).json({ token })
}