import { getType } from "typesafe-actions"
import { ApiError } from "services/ApiError"
import { Actions } from "Actions"
import { AuthActions } from "auth/AuthActions"

export interface AuthState {
  loading: boolean
  loginErrors?: ApiError
  signupErrors?: ApiError
}

const initState: AuthState = {
  loading: false,
  loginErrors: undefined,
  signupErrors: undefined,
}

const AuthReducer = (state: AuthState = initState, action: Actions): AuthState => {
  switch (action.type) {
    case getType(AuthActions.loginSubmit.request):
      return { ...state, loading: true }
    case getType(AuthActions.loginSubmit.success):
      return { ...state, loading: false, loginErrors: undefined }
    case getType(AuthActions.loginSubmit.failure):
      return { ...state, loading: false, loginErrors: action.payload }
    case getType(AuthActions.signupSubmit.request):
      return { ...state, loading: true }
    case getType(AuthActions.signupSubmit.success):
      return { ...state, loading: false, signupErrors: undefined }
    case getType(AuthActions.signupSubmit.failure):
      return { ...state, loading: false, signupErrors: action.payload }
    default: return state
  }
}

export default AuthReducer
