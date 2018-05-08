import { isActionOf } from "typesafe-actions"
import { Epic } from "redux-observable"
import { FeedsActions } from "./FeedsActions"
import { GlobalState, Dependencies } from "../app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"
import { Observable } from "rxjs/Observable"

type EpicType = Epic<Actions, GlobalState, Dependencies>

export const loadfeedsEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(FeedsActions.loadfeeds))
        .mergeMap(() =>
            dependencies.api.feedsByReaction(state.getState().app.token as string)("Liked")
                .map(feeds => FeedsActions.loadfeedsSuccess({ feeds }))
                .catch((error: ApiError) => Observable.of(FeedsActions.loadfeedsError({ error })))
        )
}
