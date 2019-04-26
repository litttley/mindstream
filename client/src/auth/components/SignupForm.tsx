import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { Signup } from "~/models/signup"
import { ApiErrors, getFieldErrorMessage } from "~/models/apiError"
import { useFormInput } from "~/hooks/useFormInput"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { useKeyDown } from "~/hooks/useKeyDown"
import { FormErrors } from "./FormErrors"
import { Input } from "~/components/Input"
import { GhostdButton } from "~/components/buttons/GhostButton"

interface Props {
  loading: boolean
  errors?: ApiErrors
  onSubmit: (signup: Signup) => void
}

export function SignupForm({ loading, errors, onSubmit }: Props) {
  const loginInput = useFormInput("")
  const emailInput = useFormInput("")
  const passwordInput = useFormInput("")
  const message = useIntlMessage()

  useKeyDown(event => {
    if (event.key === "Enter") {
      onSubmit({ login: loginInput.value, email: emailInput.value, password: passwordInput.value })
    }
  })

  const onClick = () => onSubmit({ login: loginInput.value, email: emailInput.value, password: passwordInput.value })

  return (
    <div className={css(styles.signupForm)}>
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
        style={styles.button}
        label={message("action.signup")}
        loading={loading}
        onClick={onClick}
      />
      <FormErrors errors={errors} />
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  signupForm: {
    width: "100%",
    padding: "24px",
    "@media screen and (min-width: 400px)": {
      width: "400px",
      alignSelf: "center",
    },
  },
  button: {
    width: "100%",
    height: "40px",
  },
})
