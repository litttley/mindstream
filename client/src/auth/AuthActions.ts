import { createAsyncAction, ActionType } from "typesafe-actions"
import { ApiErrors } from "services/ApiError"
import { AuthResponse } from "services/AuthResponse"
import { Login } from "auth/Login"
import { Signup } from "auth/Signup"

export const AuthActions = {
  loginSubmit: createAsyncAction(
    "LoginSubmitRequest",
    "LoginSubmitSuccess",
    "LoginSubmitFailure"
  )<Login, AuthResponse, ApiErrors>(),
  signupSubmit: createAsyncAction(
    "SignupSubmitRequest",
    "SignupSubmitSuccess",
    "SignupSubmitFailure"
  )<Signup, AuthResponse, ApiErrors>(),
}

export type AuthAction = ActionType<typeof AuthActions>
