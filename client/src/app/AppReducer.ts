import { getType } from "typesafe-actions"
import { AppActions } from "~/app/AppActions"
import { Actions } from "~/Actions"
import { User } from "~/models/User"
import { AuthActions } from "~/auth/AuthActions"

export interface AppState {
  isMenuOpen: boolean
  user?: User
  token: string
}

const initState: AppState = {
  isMenuOpen: false,
  token: "",
}

const AppReducer = (state: AppState = initState, action: Actions) => {
  switch (action.type) {
    case getType(AppActions.menuToggle): return { ...state, isMenuOpen: !state.isMenuOpen }
    case getType(AuthActions.loginSubmit.success):
      return { ...state, user: action.payload.user, token: action.payload.token }
    case getType(AuthActions.signupSubmit.success):
      return { ...state, user: action.payload.user, token: action.payload.token }
    default: return state
  }
}

export default AppReducer
