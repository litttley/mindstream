import * as React from "react"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import { makeStyles } from "@material-ui/core/styles"

import { useLogin } from "~/auth/AuthState"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { LoginForm } from "~/auth/components/LoginForm"

export function LoginScreen() {
  const classes = useStyles()
  const message = useIntlMessage()
  const { loading, loginErrors, loginSubmit } = useLogin()

  return (
    <Container maxWidth="xs">
      <Typography
        align="center"
        variant="h2"
        className={classes.appName}
      >
        Mindstream
      </Typography>
      <Grid container>
        <LoginForm
          loading={loading}
          errors={loginErrors}
          onSubmit={loginSubmit}
        />
        <Link
          href="#/signup"
          align="center"
          className={classes.link}
        >
          {message("action.signup")}
        </Link>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles(theme => ({
  appName: {
    marginTop: 50,
    marginBottom: 20,
  },
  link: {
    marginTop: 50,
  },
}))
