import * as React from "react"
import Grid from "@material-ui/core/Grid"
import TextField from "@material-ui/core/TextField"
import Button from "@material-ui/core/Button"
import CircularProgress from "@material-ui/core/CircularProgress"
import { makeStyles } from "@material-ui/core/styles"

import { Login } from "~/models/login"
import { ApiErrors, getFieldErrorMessage } from "~/models/apiError"
import { useFormInput } from "~/hooks/useFormInput"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { useKeyDown } from "~/hooks/useKeyDown"
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
  const classes = useStyles()

  useKeyDown(event => {
    if (event.key === "Enter") {
      onSubmit({ email: emailInput.value, password: passwordInput.value })
    }
  })

  const onClick = () => onSubmit({ email: emailInput.value, password: passwordInput.value })

  return (
    <Grid item xs={12}>
      <Grid item container direction="row">
        <TextField
          {...emailInput}
          type="email"
          label={message("form.email")}
          error={!!getFieldErrorMessage("email", message, errors)}
          helperText={getFieldErrorMessage("email", message, errors)}
          fullWidth
          className={classes.formItem}
        />
        <TextField
          {...passwordInput}
          type="password"
          label={message("form.password")}
          error={!!getFieldErrorMessage("password", message, errors)}
          helperText={getFieldErrorMessage("password", message, errors)}
          fullWidth
          className={classes.formItem}
        />
        <Button variant="outlined" fullWidth onClick={onClick} className={classes.formButton}>
          {message("action.login")}
        </Button>
        <Grid container justify="center" className={classes.loading}>
          {loading ? <CircularProgress /> : undefined}
          <FormErrors errors={errors} />
        </Grid>
      </Grid>
    </Grid>
  )
}

const useStyles = makeStyles({
  formItem: {
    marginBottom: 15,
  },
  formButton: {
    marginTop: 15,
  },
  loading: {
    marginTop: 20,
  },
})
