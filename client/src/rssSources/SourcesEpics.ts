import { combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of } from "rxjs"
import { filter, switchMap, mergeMap, map, catchError } from "rxjs/operators"

import { ApiErrors } from "services/ApiError"
import { SourcesActions } from "rssSources/SourcesActions"
import { EpicType } from "RootEpic"
import { AppActions } from "app/AppActions";

const addSourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(SourcesActions.addSource.request)),
  switchMap(({ payload }) => api.addSource(state.value.app.token)(payload).pipe(
    map(SourcesActions.addSource.success),
    catchError((error: ApiErrors) => of(SourcesActions.addSource.failure(error)))
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
  addSourceEpic,
  loadUnfollowedSourcesEpic,
  loadMySourcesEpic,
  fallowSourceEpic,
  fallowSourcesSuccessEpic,
)
