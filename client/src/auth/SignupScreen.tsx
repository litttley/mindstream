import * as React from "react"

import { useSignup } from "~/auth/AuthState"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { LinkButton } from "~/components/buttons/LinkButton"
import { SignupForm } from "~/auth/components/SignupForm"
import { AuthLayout } from "~/auth/components/AuthLayout"

export function SignupScreen() {
  const { loading, signupErrors, signupSubmit } = useSignup()
  const message = useIntlMessage()

  return (
    <AuthLayout>
      <SignupForm
        loading={loading}
        errors={signupErrors}
        onSubmit={signupSubmit}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LinkButton href="#/login">{message("action.login")}</LinkButton>
      </div>
    </AuthLayout>
  )
}
