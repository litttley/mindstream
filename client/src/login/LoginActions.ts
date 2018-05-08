import { buildAction, ActionsUnion } from "typesafe-actions"
import { ApiError } from "services/ApiError"
import { AuthResponse } from "services/AuthResponse"

export const LoginActions = {
    loginChange: buildAction("LoginChange").payload<{ field: string, value: string }>(),
    loginSubmit: buildAction("LoginSubmit").payload<{ email: string, password: string }>(),
    loginSubmitSuccess: buildAction("LoginSubmitSuccess").payload<{ auth: AuthResponse }>(),
    loginSubmitError: buildAction("LoginSubmitError").payload<{ error: ApiError }>(),
}

export type LoginAction = ActionsUnion<typeof LoginActions>
