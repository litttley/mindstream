import { combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of, interval } from "rxjs"
import { filter, switchMap, mergeMap, map, catchError, debounce } from "rxjs/operators"

import { ApiErrors } from "~/services/ApiError"
import { SourcesActions } from "~/rssSources/SourcesActions"
import { EpicType } from "~/RootEpic"
import { AppActions } from "~/app/AppActions"

const searchRssSource: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(SourcesActions.searchRssSources.request)),
  debounce(() => interval(1000)),
  switchMap(({ payload }) => {
    if (payload === "") {
      return of(SourcesActions.searchRssSources.success([]))
    } else {
      return api.searchRssSource(payload).pipe(
        map(SourcesActions.searchRssSources.success),
        catchError((error: ApiErrors) => of(SourcesActions.searchRssSources.failure(error)))
      )
    }
  }),
)

const loadMySourcesEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(AppActions.start)),
  switchMap(() => api.loadMySources(state.value.app.token).pipe(
    map(SourcesActions.loadMySources.success),
    catchError((error: ApiErrors) => of(SourcesActions.loadMySources.failure(error)))
  ))
)

const fallowSourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(SourcesActions.fallowSources.request)),
  mergeMap(({ payload }) => api.fallowSource(state.value.app.token)(payload).pipe(
    map(SourcesActions.fallowSources.success),
    catchError((error: ApiErrors) => of(SourcesActions.fallowSources.failure(error)))
  ))
)

const fallowSourcesSuccessEpic: EpicType = action$ => action$.pipe(
  filter(isActionOf(SourcesActions.fallowSources.success)),
  map(({ payload }) => SourcesActions.addMySource(payload)),
)

export const sourcesEpics = combineEpics(
  searchRssSource,
  loadMySourcesEpic,
  fallowSourceEpic,
  fallowSourcesSuccessEpic,
)
