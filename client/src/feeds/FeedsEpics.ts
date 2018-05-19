import { Epic } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of } from "rxjs"
import { filter, switchMap, map, catchError } from "rxjs/operators"

import { FeedsActions } from "./FeedsActions"
import { GlobalState, Dependencies } from "../app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"

type EpicType = Epic<Actions, GlobalState, Dependencies>

export const loadfeedsEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(FeedsActions.loadfeeds)),
    switchMap(() => api.feedsByReaction(state.value.app.token)("Liked").pipe(
        map(FeedsActions.loadfeedsSuccess),
        catchError((error: ApiError) => of(FeedsActions.loadfeedsError(error))),
    )),
)
