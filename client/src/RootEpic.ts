import { combineEpics } from "redux-observable"
import { sourcesEpics } from "rssSources/SourcesEpics"
import { mindstreamEpics } from "mindstream/MindStreamEpics"
import { loadfeedsEpic } from "feeds/FeedsEpics"
import { authEpics } from "auth/AuthEpics"
import { appEpics } from "app/AppEpics"

const RootEpic = combineEpics(
    authEpics,
    sourcesEpics,
    mindstreamEpics,
    loadfeedsEpic,
    appEpics,
)

export default RootEpic
