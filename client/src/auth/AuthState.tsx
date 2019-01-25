import * as React from "react"
import { User } from "~/models/User"
import { createStore } from "~/store"
import { ApiErrors } from "~/models/ApiError"
import { api } from "~/services/Api"
import * as router from "~/router"
import { Signup } from "~/models/Signup"
import { Login } from "~/models/Login"

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
    update({ ...state, loading: true })
    api
      .login(login)
      .then(response => {
        update({ ...state, ...response, loading: false })
        router.replace("/")
      })
      .catch(loginErrors => {
        update({ ...state, loginErrors, loading: false })
      })
  }

  return {
    loading: state.loading,
    loginErrors: state.loginErrors,
    loginSubmit
  }
}

export function useSignup() {
  const { update, ...state } = React.useContext(AuthContext)
  const signupSubmit = (signup: Signup) => {
    update({ ...state, loading: true })
    api
      .signup(signup)
      .then(response => {
        update({ ...state, ...response, loading: false })
        router.replace("/")
      })
      .catch(signupErrors => {
        update({ ...state, signupErrors, loading: false })
      })
  }

  return {
    loading: state.loading,
    signupErrors: state.signupErrors,
    signupSubmit
  }
}
