import * as React from "react"

import * as router from "~/router"
import { createStore } from "~/Store"
import { api } from "~/services/api"
import { User } from "~/models/user"
import { Signup } from "~/models/signup"
import { Login } from "~/models/login"
import { ApiErrors } from "~/models/apiError"

export interface AuthState {
  user?: User
  loading: boolean
  loginErrors?: ApiErrors
  signupErrors?: ApiErrors
}

const initState: AuthState = {
  loading: false,
}

export const [AuthContext, AuthProvider] = createStore(initState)

export function useLogin() {
  const { update, ...state } = React.useContext(AuthContext)

  const loginSubmit = (login: Login) => {
    update({ loading: true })
    api
      .login(login)
      .then(response => {
        update({ ...response, loading: false })
        router.replace("/")
      })
      .catch(loginErrors => {
        // tslint:disable-next-line: no-unsafe-any
        update({ loginErrors, loading: false })
      })
  }

  return {
    loading: state.loading,
    loginErrors: state.loginErrors,
    loginSubmit,
  }
}

export function useSignup() {
  const { update, ...state } = React.useContext(AuthContext)
  const signupSubmit = (signup: Signup) => {
    update({ loading: true })
    api
      .signup(signup)
      .then(response => {
        update({ ...response, loading: false })
        router.replace("/")
      })
      .catch(signupErrors => {
        // tslint:disable-next-line: no-unsafe-any
        update({ signupErrors, loading: false })
      })
  }

  return {
    loading: state.loading,
    signupErrors: state.signupErrors,
    signupSubmit,
  }
}
