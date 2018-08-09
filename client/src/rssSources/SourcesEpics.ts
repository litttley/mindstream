import { combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of } from "rxjs"
import { filter, switchMap, mergeMap, map, catchError } from "rxjs/operators"

import { ApiErrors } from "services/ApiError"
import { EpicType } from "EpicType"
import { SourcesActions } from "rssSources/SourcesActions"

const addSourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(SourcesActions.addSource)),
  switchMap(({ payload: { sourceUrl } }) => api.addSource(state.value.app.token)(sourceUrl).pipe(
    map(SourcesActions.addSourceSuccess),
    catchError((error: ApiErrors) => of(SourcesActions.addSourceError(error)))
  ))
)

const loadUnfollowedSourcesEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(SourcesActions.loadUnfollowedSources.request)),
  switchMap(() => api.loadUnfollowedSources(state.value.app.token).pipe(
    map(SourcesActions.loadUnfollowedSources.success),
    catchError((error: ApiErrors) => of(SourcesActions.loadUnfollowedSources.failure(error)))
  ))
)

const loadMySourcesEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(SourcesActions.loadMySources.request)),
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
  addSourceEpic,
  loadUnfollowedSourcesEpic,
  loadMySourcesEpic,
  fallowSourceEpic,
  fallowSourcesSuccessEpic,
)
