import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import {
  ContainerRegistrationKeys,
  generateJwtToken,
  MedusaError,
  Modules,
} from "@medusajs/framework/utils"
import { createCustomerAccountWorkflow } from "@medusajs/core-flows"
import { z } from "zod"

// POST /store/auth/register
// Registers a new customer (end-user): creates the emailpass auth identity,
// creates the linked customer record, and returns a JWT token ready to use.
//
// Signup in Medusa is two steps under the hood:
//   1. authModule.register(...)            -> stores email + hashed password
//   2. createCustomerAccountWorkflow(...)  -> creates the Customer and links
//                                             it to the auth identity
// We orchestrate both here so the frontend gets a single endpoint.

export const PostStoreAuthRegisterSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
  first_name: z.string().optional(),
  last_name: z.string().optional(),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const { email, password, first_name, last_name } =
    PostStoreAuthRegisterSchema.parse(req.body)

  const config = req.scope.resolve(ContainerRegistrationKeys.CONFIG_MODULE)
  const authModule = req.scope.resolve(Modules.AUTH)

  // 1. Create the credentials (auth identity) for the customer actor.
  const { success, authIdentity, error } = await authModule.register(
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
    // Most common cause: an account with this email already exists.
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      error || "Unable to register with the provided credentials"
    )
  }

  // 2. Create the Customer profile and link it to the auth identity.
  const { result: customer } = await createCustomerAccountWorkflow(
    req.scope
  ).run({
    input: {
      authIdentityId: authIdentity.id,
      customerData: { email, first_name, last_name },
    },
  })

  // 3. Mint a JWT carrying the freshly-created customer id.
  const { http } = config.projectConfig

  const token = generateJwtToken(
    {
      actor_id: customer.id,
      actor_type: "customer",
      auth_identity_id: authIdentity.id ?? "",
      auth_provider: "emailpass",
      app_metadata: { customer_id: customer.id },
    },
    {
      secret: http.jwtSecret,
      expiresIn: http.jwtExpiresIn,
      jwtOptions: http.jwtOptions,
    }
  )

  return res.status(200).json({ token, customer })
}