import { combineEpics } from "redux-observable"
import { sourcesEpics } from "./sources/SourcesEpics"
import { signupEpics } from "./signup/SignupEpics"
import { mindstreamEpics } from "./mindstream/MindStreamEpics"
import { loadfeedsEpic } from "./feeds/FeedsEpics"
import { loginEpics } from "./login/LoginEpics"

const RootEpic = combineEpics(
    loginEpics,
    sourcesEpics,
    mindstreamEpics,
    loadfeedsEpic,
    signupEpics,
)

export default RootEpic
