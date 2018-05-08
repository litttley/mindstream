import { combineEpics } from "redux-observable"
import * as SourcesEpics from "./sources/SourcesEpics"
import { signupEpic, signupSuccessEpic } from "./signup/SignupEpics"
import { mindstreamEpics } from "./mindstream/MindStreamEpics"
import { loadfeedsEpic } from "./feeds/FeedsEpics"
import { loginEpics } from "./login/LoginEpics"

const RootEpic = combineEpics(
    loginEpics,
    SourcesEpics.addSourceEpic,
    SourcesEpics.loadUnfollowedSourcesEpic,
    SourcesEpics.loadMySourcesEpic,
    SourcesEpics.fallowSourceEpic,
    SourcesEpics.fallowSourcesSuccessEpic,
    mindstreamEpics,
    loadfeedsEpic,
    signupEpic,
    signupSuccessEpic,
)

export default RootEpic
