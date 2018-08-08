import { getType } from "typesafe-actions"
import { ApiError } from "services/ApiError"
import { Actions } from "Actions"
import { AuthActions } from "auth/AuthActions"
import { User } from "models/User"

export interface AuthState {
  user?: User
  token: string
  loading: boolean
  errors?: ApiError
}

const initState: AuthState = {
  token: "",
  loading: false,
  errors: undefined,
}

const AuthReducer = (state: AuthState = initState, action: Actions): AuthState => {
  switch (action.type) {
    case getType(AuthActions.loginSubmit.request):
      return { ...state, loading: true }
    case getType(AuthActions.loginSubmit.success):
      return { ...state, loading: false, user: action.payload.user, token: action.payload.token }
    case getType(AuthActions.loginSubmit.failure):
      return { ...state, loading: false, errors: action.payload }
    default: return state
  }
}

export default AuthReducer
