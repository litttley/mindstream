import { getType } from "typesafe-actions"
import { SignupActions } from "./SignupActions"
import { Actions } from "Actions"

export interface SignupState {
    login: string
    email: string
    password: string
    loading: boolean
    error?: any
}

const initState: SignupState = {
    login: "",
    email: "",
    password: "",
    loading: false,
    error: undefined,
}

const SignupReducer = (state: SignupState = initState, action: Actions) => {
    switch (action.type) {
        case getType(SignupActions.signupChange): return { ...state, [action.payload.field]: action.payload.value }
        case getType(SignupActions.signupSubmit): return { ...state, loading: true, error: undefined }
        case getType(SignupActions.signupSubmitSuccess): return { ...state, loading: false, login: "", email: "", password: "" }
        case getType(SignupActions.signupSubmitError): return { ...state, error: action.payload.error, loading: false }
        default: return state
    }
}

export default SignupReducer
