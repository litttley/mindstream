import * as React from "react"
import { LoginForm } from "~/auth/components/LoginForm"
import { AuthLayout } from "~/auth/components/AuthLayout"
import { LinkButton } from "~/components/buttons/LinkButton"
import { useLogin } from "~/auth/AuthState"
import { useIntlMessage } from "~/hooks/useIntlMessage"

export function LoginScreen() {
  const { loading, loginErrors, loginSubmit } = useLogin()
  const message = useIntlMessage()

  return (
    <AuthLayout>
      <LoginForm
        loading={loading}
        errors={loginErrors}
        onSubmit={loginSubmit}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LinkButton href="#/signup">{message("action.signup")}</LinkButton>
      </div>
    </AuthLayout>
  )
}
