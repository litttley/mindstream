import { isActionOf } from "typesafe-actions"
import { of } from "rxjs"
import { filter, switchMap, map, catchError } from "rxjs/operators"

import { ApiErrors } from "services/ApiError"
import { FeedsActions } from "feeds/FeedsActions"
import { EpicType } from "RootEpic"

export const loadfeedsEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(FeedsActions.loadfeeds.request)),
  switchMap(() => api.getRssFeeds(state.value.app.token, "Liked").pipe(
    map(FeedsActions.loadfeeds.success),
    catchError((error: ApiErrors) => of(FeedsActions.loadfeeds.failure(error))),
  )),
)
