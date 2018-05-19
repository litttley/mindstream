import { createAction, ActionType } from "typesafe-actions"
import { ApiError } from "services/ApiError"
import { AuthResponse } from "services/AuthResponse"

export const SignupActions = {
    signupChange: createAction("SignupChange", resolve => (field: string, value: string) => resolve({ field, value })),
    signupSubmit: createAction("SignupSubmit", resolve => (login: string, email: string, password: string) => resolve({ login, email, password })),
    signupSubmitSuccess: createAction("SignupSubmitSuccess", resolve => (auth: AuthResponse) => resolve({ auth })),
    signupSubmitError: createAction("SignupSubmitError", resolve => (error: ApiError) => resolve({ error })),
}

export type SignupAction = ActionType<typeof SignupActions>
