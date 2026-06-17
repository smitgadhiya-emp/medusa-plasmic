import LoginForm from "@modules/account/components/auth-card/login-form"

// Standalone preview of the LoginForm so you can eyeball it in isolation.
// Visit http://localhost:8000/login-preview
export default function LoginPreviewPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-6">
      <LoginForm />
    </div>
  )
}
