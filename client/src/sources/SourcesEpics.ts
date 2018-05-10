import { Epic, combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of } from "rxjs"
import { filter, switchMap, mergeMap, map, catchError } from "rxjs/operators"

import { SourcesActions } from "./SourcesActions"
import { GlobalState, Dependencies } from "app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"

type EpicType = Epic<Actions, GlobalState, Dependencies>

const addSourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(SourcesActions.addSource)),
    switchMap(({ payload: { sourceUrl } }) => api.addSource(state.value.app.token)(sourceUrl).pipe(
        map(source => SourcesActions.addSourceSuccess({ source })),
        catchError((error: ApiError) => of(SourcesActions.addSourceError({ error })))
    ))
)

const loadUnfollowedSourcesEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(SourcesActions.loadUnfollowedSources)),
    switchMap(() => api.loadUnfollowedSources(state.value.app.token).pipe(
        map(sources => SourcesActions.loadUnfollowedSourcesSuccess({ sources })),
        catchError((error: ApiError) => of(SourcesActions.loadUnfollowedSourcesError({ error })))
    ))
)

const loadMySourcesEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(SourcesActions.loadMySources)),
    switchMap(() => api.loadMySources(state.value.app.token).pipe(
        map(sources => SourcesActions.loadMySourcesSuccess({ sources })),
        catchError((error: ApiError) => of(SourcesActions.loadMySourcesError({ error })))
    ))
)

const fallowSourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(SourcesActions.fallowSources)),
    mergeMap(({ payload: { source } }) => api.fallowSource(state.value.app.token)(source).pipe(
        map(updatedRssSource => SourcesActions.fallowSourcesSuccess({ source: updatedRssSource })),
        catchError((error: ApiError) => of(SourcesActions.fallowSourcesError({ error })))
    ))
)

const fallowSourcesSuccessEpic: EpicType = action$ => action$.pipe(
    filter(isActionOf(SourcesActions.fallowSourcesSuccess)),
    map(({ payload: { source } }) => SourcesActions.addMySource({ source })),
)

export const sourcesEpics = combineEpics(
    addSourceEpic,
    loadUnfollowedSourcesEpic,
    loadMySourcesEpic,
    fallowSourceEpic,
    fallowSourcesSuccessEpic,
)
