import { createAsyncAction, ActionType } from "typesafe-actions"
import { ApiError } from "services/ApiError"
import { AuthResponse } from "services/AuthResponse"
import { Login } from "auth/Login"
import { Signup } from "auth/Signup"

export const AuthActions = {
  loginSubmit: createAsyncAction(
    "LoginSubmitRequest",
    "LoginSubmitSuccess",
    "LoginSubmitFailure"
  )<Login, AuthResponse, ApiError>(),
  signupSubmit: createAsyncAction(
    "SignupSubmitRequest",
    "SignupSubmitSuccess",
    "SignupSubmitFailure"
  )<Signup, AuthResponse, ApiError>(),
}

export type AuthAction = ActionType<typeof AuthActions>
