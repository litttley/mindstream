import { combineEpics } from "redux-observable"
import { sourcesEpics } from "rssSources/SourcesEpics"
import { signupEpics } from "signup/SignupEpics"
import { mindstreamEpics } from "mindstream/MindStreamEpics"
import { loadfeedsEpic } from "feeds/FeedsEpics"
import { loginEpics } from "login/LoginEpics"
import { appEpics } from "app/AppEpics"

const RootEpic = combineEpics(
    loginEpics,
    sourcesEpics,
    mindstreamEpics,
    loadfeedsEpic,
    signupEpics,
    appEpics,
)

export default RootEpic
