import { buildAction, ActionsUnion } from "typesafe-actions"
import { ApiError } from "services/ApiError"
import { AuthResponse } from "services/AuthResponse"

export const SignupActions = {
    signupChange: buildAction("SignupChange").payload<{ field: string, value: string }>(),
    signupSubmit: buildAction("SignupSubmit").payload<{  login: string, email: string, password: string }>(),
    signupSubmitSuccess: buildAction("SignupSubmitSuccess").payload<{ auth: AuthResponse }>(),
    signupSubmitError: buildAction("SignupSubmitError").payload<{ error: ApiError }>(),
}

export type SignupAction = ActionsUnion<typeof SignupActions>
