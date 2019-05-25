import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { Login } from "~/models/login"
import { ApiErrors, getFieldErrorMessage } from "~/models/apiError"
import { useFormInput } from "~/hooks/useFormInput"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { useKeyDown } from "~/hooks/useKeyDown"
import { Input } from "~/components/Input"
import { GhostdButton } from "~/components/buttons/GhostButton"
import { FormErrors } from "./FormErrors"

interface Props {
  loading: boolean
  errors?: ApiErrors
  onSubmit: (login: Login) => void
}

export function LoginForm({ errors, loading, onSubmit }: Props) {
  const emailInput = useFormInput("")
  const passwordInput = useFormInput("")
  const message = useIntlMessage()

  useKeyDown(event => {
    if (event.key === "Enter") {
      onSubmit({ email: emailInput.value, password: passwordInput.value })
    }
  })

  const onClick = () => onSubmit({ email: emailInput.value, password: passwordInput.value })

  return (
    <div className={css(styles.loginForm)}>
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
      <GhostdButton style={styles.button} label={message("action.login")} loading={loading} onClick={onClick} />
      <FormErrors errors={errors} />
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  loginForm: {
    width: "100%",
    padding: "24px",
    "@media screen and (min-width: 400px)": {
      width: "400px",
      alignSelf: "center"
    }
  },
  button: {
    width: "100%",
    height: "40px"
  }
})
