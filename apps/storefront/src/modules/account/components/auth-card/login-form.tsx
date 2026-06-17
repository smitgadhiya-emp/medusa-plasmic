"use client"

import { Eye, EyeSlash } from "@medusajs/icons"
import * as React from "react"

import { Button } from "@modules/common/components/ui/button"

export interface LoginFormProps {
  title?: string
  emailPlaceholder?: string
  passwordPlaceholder?: string
  forgotLabel?: string
  submitLabel?: string
  registerPrompt?: string
  registerLabel?: string
  className?: string
  onLogin?: (values: { email: string; password: string }) => void
  onForgot?: () => void
  onRegister?: () => void
}

export function LoginForm({
  title = "Welcome Back",
  emailPlaceholder = "E-mail",
  passwordPlaceholder = "Password",
  forgotLabel = "Forgot your password??",
  submitLabel = "Login",
  registerPrompt = "Don't have an account?",
  registerLabel = "Create Account",
  className,
  onLogin,
  onForgot,
  onRegister,
}: LoginFormProps) {
  const [showPassword, setShowPassword] = React.useState(false)
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")

  const inputClass =
    "w-full rounded-md bg-neutral-800/70 border border-neutral-700 px-4 py-3 text-neutral-100 placeholder:text-neutral-500 focus:outline-none focus:border-neutral-500"

  return (
    <div
      className={
        "w-full max-w-lg rounded-2xl border border-blue-900/60 bg-neutral-950 px-8 py-10 text-center " +
        (className ?? "")
      }
    >
      <h1 className="mb-8 text-4xl font-extrabold tracking-tight text-white">
        {title}
      </h1>

      <form
        className="flex flex-col gap-4"
        onSubmit={(e) => {
          e.preventDefault()
          onLogin?.({ email, password })
        }}
      >
        <input
          type="email"
          className={inputClass}
          placeholder={emailPlaceholder}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className={inputClass + " pr-12"}
            placeholder={passwordPlaceholder}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-200"
          >
            {showPassword ? <EyeSlash /> : <Eye />}
          </button>
        </div>

        <div className="mt-2 flex flex-col items-center gap-2">
          <Button type="submit" variant="legoBlue" shape="lego" size="lg">
            {submitLabel}
          </Button>
          <button
            type="button"
            onClick={onForgot}
            className="text-sm font-semibold text-amber-300 hover:text-amber-200"
          >
            {forgotLabel}
          </button>
        </div>
      </form>

      <hr className="my-7 border-neutral-700" />

      <p className="mb-4 font-bold text-white">{registerPrompt}</p>
      <Button
        type="button"
        variant="legoGold"
        shape="lego"
        size="lg"
        onClick={onRegister}
      >
        {registerLabel}
      </Button>
    </div>
  )
}

export default LoginForm
