import * as React from "react"
import Container from "@material-ui/core/Container"
import Grid from "@material-ui/core/Grid"
import Typography from "@material-ui/core/Typography"
import Link from "@material-ui/core/Link"
import { makeStyles } from "@material-ui/core/styles"

import { useSignup } from "~/auth/AuthState"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { SignupForm } from "~/auth/components/SignupForm"

export function SignupScreen() {
  const classes = useStyles()
  const message = useIntlMessage()
  const { loading, signupErrors, signupSubmit } = useSignup()

  return (
    <Container maxWidth="xs">
      <Typography align="center" variant="h2" className={classes.appName}>
        Mindstream
      </Typography>
      <Grid container>
        <SignupForm loading={loading} errors={signupErrors} onSubmit={signupSubmit} />
        <Grid container justify="center">
          <Link href="#/login" align="center" className={classes.link}>
            {message("action.login")}
          </Link>
        </Grid>
      </Grid>
    </Container>
  )
}

const useStyles = makeStyles(theme => ({
  appName: {
    marginTop: 50,
    marginBottom: 20
  },
  link: {
    marginTop: 20
  }
}))
