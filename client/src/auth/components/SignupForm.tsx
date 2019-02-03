import * as React from "react"
import * as styles from "./SignupForm.css"
import Input from "~/components/Input"
import { ApiErrors, getFieldErrorMessage } from "~/models/ApiError"
import { Signup } from "~/models/Signup"
import GhostdButton from "~/components/buttons/GhostButton"
import { useFormInput } from "~/hooks/useFormInput"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { useKeyDown } from "~/hooks/useKeyDown"
import FormErrors from "./FormErrors"

interface Props {
  loading: boolean
  errors?: ApiErrors
  onSubmit: (signup: Signup) => void
}

export default function SignupForm({ loading, errors, onSubmit }: Props) {
  const loginInput = useFormInput("")
  const emailInput = useFormInput("")
  const passwordInput = useFormInput("")
  const message = useIntlMessage()

  useKeyDown(event => {
    if (event.key === "Enter") {
      onSubmit({ login: loginInput.value, email: emailInput.value, password: passwordInput.value })
    }
  })

  return (
    <div className={styles.signupForm}>
      <Input
        {...loginInput}
        label={message("form.login")}
        type="text"
        error={getFieldErrorMessage("login", message, errors)}
      />
      <Input
        {...emailInput}
        label={message("form.email")}
        type="email"
        error={getFieldErrorMessage("email", message, errors)}
      />
      <Input
        {...passwordInput}
        label={message("form.password")}
        type="password"
        error={getFieldErrorMessage("password", message, errors)}
      />
      <GhostdButton
        className={styles.button}
        label={message("action.signup")}
        loading={loading}
        onClick={() => onSubmit({ login: loginInput.value, email: emailInput.value, password: passwordInput.value })}
      />
      <FormErrors errors={errors} />
    </div>
  )
}
