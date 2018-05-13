import { getType } from "typesafe-actions"
import { AppActions } from "app/AppActions"
import { Actions } from "Actions"
import { User } from "models/User"
import { LoginActions } from "login/LoginActions"
import { SignupActions } from "signup/SignupActions"

export interface AppState {
    isMenuOpen: boolean
    token: string
    user?: User,
}

const initState: AppState = {
    isMenuOpen: false,
    token: "",
}

const AppReducer = (state: AppState = initState, action: Actions) => {
    switch (action.type) {
        case getType(AppActions.menuToggle): return { ...state, isMenuOpen: action.payload.isMenuOpen }
        case getType(LoginActions.loginSubmitSuccess): return { ...state, token: action.payload.auth.token, user: action.payload.auth.user }
        case getType(SignupActions.signupSubmitSuccess): return { ...state, token: action.payload.auth.token, user: action.payload.auth.user }
        case getType(AppActions.logout): return { ...state, token: "", user: undefined }
        default: return state
    }
}

export default AppReducer
