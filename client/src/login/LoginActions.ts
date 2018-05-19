import { createAction, ActionType } from "typesafe-actions"
import { ApiError } from "services/ApiError"
import { AuthResponse } from "services/AuthResponse"

export const LoginActions = {
    loginChange: createAction("LoginChange", resolve => (field: string, value: string) => resolve({ field, value })),
    loginSubmit: createAction("LoginSubmit", resolve => (email: string, password: string) => resolve({ email, password })),
    loginSubmitSuccess: createAction("LoginSubmitSuccess", resolve => (auth: AuthResponse) => resolve({ auth })),
    loginSubmitError: createAction("LoginSubmitError", resolve => (error: ApiError) => resolve({ error })),
}

export type LoginAction = ActionType<typeof LoginActions>
