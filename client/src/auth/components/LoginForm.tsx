import * as React from "react"
import * as styles from "./LoginForm.css"
import Input from "~/components/Input"
import { ApiErrors, getFieldErrorMessage } from "~/models/ApiError"
import { Login } from "~/models/Login"
import GhostdButton from "~/components/buttons/GhostButton"
import FormErrors from "./FormErrors"
import { useFormInput } from "~/hooks/useFormInput"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { useKeyDown } from "~/hooks/useKeyDown"

interface Props {
  loading: boolean
  errors?: ApiErrors
  onSubmit: (login: Login) => void
}

export default function LoginForm({ errors, loading, onSubmit }: Props) {
  const emailInput = useFormInput("")
  const passwordInput = useFormInput("")
  const emailLabel = useIntlMessage("form.email")
  const passwordLabel = useIntlMessage("form.password")
  const loginLabel = useIntlMessage("action.login")
  useKeyDown(event => {
    if (event.key === "Enter") {
      onSubmit({ email: emailInput.value, password: passwordInput.value })
    }
  })

  return (
    <div className={styles.loginForm}>
      <Input
        {...emailInput}
        label={emailLabel}
        type="email"
        error={getFieldErrorMessage("email", errors)}
      />
      <Input
        {...passwordInput}
        label={passwordLabel}
        type="password"
        error={getFieldErrorMessage("password", errors)}
      />
      <GhostdButton
        className={styles.button}
        label={loginLabel}
        loading={loading}
        onClick={() => onSubmit({ email: emailInput.value, password: passwordInput.value })}
      />
      <FormErrors errors={errors} />
    </div>
  )
}
