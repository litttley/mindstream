import { RouterAction } from "react-router-redux"
import { AppAction } from "app/AppActions"
import { LoginAction } from "login/LoginActions"
import { SignupAction } from "signup/SignupActions"
import { MindStreamAction } from "mindstream/MindStreamActions"
import { SourcesAction } from "rssSources/SourcesActions"
import { FeedsAction } from "feeds/FeedsActions"

export type Actions =
    RouterAction |
    AppAction |
    LoginAction |
    SignupAction |
    MindStreamAction |
    SourcesAction |
    FeedsAction
