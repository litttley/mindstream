import { combineEpics, Epic } from "redux-observable"
import { sourcesEpics } from "~/rssSources/SourcesEpics"
import { mindstreamEpics } from "~/mindstream/MindStreamEpics"
import { loadfeedsEpic } from "~/feeds/FeedsEpics"
import { authEpics } from "~/auth/AuthEpics"
import { appEpics } from "~/app/AppEpics"
import { Actions } from "~/Actions"
import { GlobalState, Dependencies } from "~/Store"

export type EpicType = Epic<Actions, Actions, GlobalState, Dependencies>

const RootEpic = combineEpics(
  authEpics,
  sourcesEpics,
  mindstreamEpics,
  loadfeedsEpic,
  appEpics,
)

export default RootEpic
