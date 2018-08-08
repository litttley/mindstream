import { RouterState } from "react-router-redux"

import { AppState } from "./AppReducer"
import { SignupState } from "../signup/SignupReducer"
import { FeedsState } from "../feeds/FeedsReducer"
import { MindStreamState } from "../mindstream/MindStreamReducer"
import { SourcesState } from "rssSources/SourcesReducer"
import { Requests } from "services/Api"
import { AuthState } from "auth/AuthReducer"

export interface GlobalState {
    app: AppState
    auth: AuthState
    signup: SignupState
    feeds: FeedsState
    mindStream: MindStreamState
    sources: SourcesState
    router: RouterState
}

export interface Dependencies {
    api: Requests
}
