import { RouterAction } from "react-router-redux"
import { AppAction } from "app/AppActions"
import { SignupAction } from "signup/SignupActions"
import { MindStreamAction } from "mindstream/MindStreamActions"
import { SourcesAction } from "rssSources/SourcesActions"
import { FeedsAction } from "feeds/FeedsActions"
import { AuthAction } from "auth/AuthActions"

export type Actions =
    RouterAction |
    AppAction |
    SignupAction |
    MindStreamAction |
    SourcesAction |
    FeedsAction |
    AuthAction
