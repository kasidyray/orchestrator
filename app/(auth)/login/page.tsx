import Link from "next/link"

import { LoginForm } from "@/components/features/auth/login-form"

export default function LoginPage() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-2">
        <h1 className="text-2xl font-semibold tracking-tight">
          Sign in to Optimus
        </h1>
        <p className="text-sm text-muted-foreground">
          Welcome back. Enter your details to continue.
        </p>
      </div>

      <LoginForm />

      <p className="text-center text-sm text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link
          href="/register"
          className="font-medium text-foreground underline-offset-4 hover:underline"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
