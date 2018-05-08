import { isActionOf } from "typesafe-actions"
import { SourcesActions } from "./SourcesActions"
import { Epic } from "redux-observable"
import { GlobalState, Dependencies } from "app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"
import { Observable } from "rxjs/Observable"

type EpicType = Epic<Actions, GlobalState, Dependencies>

export const addSourceEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(SourcesActions.addSource))
        .mergeMap(({ payload: { sourceUrl } }) =>
            dependencies.api.addSource(state.getState().app.token as string)(sourceUrl)
                .map(source => SourcesActions.addSourceSuccess({ source }))
                .catch((error: ApiError) => Observable.of(SourcesActions.addSourceError({ error })))
        )
}

export const loadUnfollowedSourcesEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(SourcesActions.loadUnfollowedSources))
        .mergeMap(() =>
            dependencies.api.loadUnfollowedSources(state.getState().app.token as string)
                .map(sources => SourcesActions.loadUnfollowedSourcesSuccess({ sources }))
                .catch((error: ApiError) => Observable.of(SourcesActions.loadUnfollowedSourcesError({ error })))
        )
}

export const loadMySourcesEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(SourcesActions.loadMySources))
        .mergeMap(() =>
            dependencies.api.loadMySources(state.getState().app.token as string)
                .map(sources => SourcesActions.loadMySourcesSuccess({ sources }))
                .catch((error: ApiError) => Observable.of(SourcesActions.loadMySourcesError({ error })))
        )
}

export const fallowSourceEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(SourcesActions.fallowSources))
        .mergeMap(({ payload: { source } }) =>
            dependencies.api.fallowSource(state.getState().app.token as string)(source)
                .map(updatedRssSource => SourcesActions.fallowSourcesSuccess({ source: updatedRssSource }))
                .catch((error: ApiError) => Observable.of(SourcesActions.fallowSourcesError({ error })))
        )
}

export const fallowSourcesSuccessEpic: EpicType = action$ => {
    return action$
        .filter(isActionOf(SourcesActions.fallowSourcesSuccess))
        .map(({ payload: { source } }) => SourcesActions.addMySource({ source }))
}
