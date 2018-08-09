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
  filter(isActionOf(SourcesActions.loadMySources)),
  switchMap(() => api.loadMySources(state.value.app.token).pipe(
    map(SourcesActions.loadMySourcesSuccess),
    catchError((error: ApiErrors) => of(SourcesActions.loadMySourcesError(error)))
  ))
)

const fallowSourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(SourcesActions.fallowSources)),
  mergeMap(({ payload: { source } }) => api.fallowSource(state.value.app.token)(source).pipe(
    map(SourcesActions.fallowSourcesSuccess),
    catchError((error: ApiErrors) => of(SourcesActions.fallowSourcesError(error)))
  ))
)

const fallowSourcesSuccessEpic: EpicType = action$ => action$.pipe(
  filter(isActionOf(SourcesActions.fallowSourcesSuccess)),
  map(({ payload: { source } }) => SourcesActions.addMySource(source)),
)

export const sourcesEpics = combineEpics(
  addSourceEpic,
  loadUnfollowedSourcesEpic,
  loadMySourcesEpic,
  fallowSourceEpic,
  fallowSourcesSuccessEpic,
)
