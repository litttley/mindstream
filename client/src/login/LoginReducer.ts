import { getType } from "typesafe-actions"
import { LoginActions } from "./LoginActions"
import { ApiError } from "services/ApiError"
import { Actions } from "Actions"

export interface LoginState {
    email: string
    password: string
    loading: boolean
    error?: ApiError
}

const initState: LoginState = {
    email: "",
    password: "",
    loading: false,
    error: undefined,
}

const LoginReducer = (state: LoginState = initState, action: Actions) => {
    switch (action.type) {
        case getType(LoginActions.loginChange): return { ...state, [action.payload.field]: action.payload.value }
        case getType(LoginActions.loginSubmit): return { ...state, loading: true, error: undefined }
        case getType(LoginActions.loginSubmitSuccess): return { ...state, loading: false, email: "", password: "" }
        case getType(LoginActions.loginSubmitError): return { ...state, error: action.payload.error, loading: false }
        default: return state
    }
}

export default LoginReducer
