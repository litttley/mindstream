import { Epic, combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of } from "rxjs"
import { filter, switchMap, mergeMap, map, catchError } from "rxjs/operators"

import { MindStreamActions } from "./MindStreamActions"
import { GlobalState, Dependencies } from "../app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"

type EpicType = Epic<Actions, Actions, GlobalState, Dependencies>

const loadUnreadedFeedsEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(MindStreamActions.loadUnreadedFeeds)),
    switchMap(() => api.getRssFeeds(state.value.auth.token, "Unreaded").pipe(
        map(MindStreamActions.loadUnreadedFeedsSuccess),
        catchError((error: ApiError) => of(MindStreamActions.mindstreamApiError(error)))
    ))
)

const loadUnreadedFeedsBySourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(MindStreamActions.loadUnreadedFeedsBySource)),
    switchMap(({ payload: { sourceUuid } }) => api.getRssFeeds(state.value.auth.token, "Unreaded", sourceUuid).pipe(
        map(MindStreamActions.loadUnreadedFeedsBySourceSuccess),
        catchError((error: ApiError) => of(MindStreamActions.mindstreamApiError(error)))
    ))
)

const nextFeedEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(MindStreamActions.nextFeed)),
    switchMap(({ payload: { feed, sourceUuid } }) => api.feedReaction(state.value.auth.token)(feed, "Readed").pipe(
        map(updatedFeed => MindStreamActions.nextFeedSuccess(updatedFeed, updatedFeed.rss_source_uuid)),
        catchError((error: ApiError) => of(MindStreamActions.mindstreamApiError(error)))
    ))
)

const reloadUnreadedFeedsEpic: EpicType = (action$, state, { api }) => action$.pipe(
    filter(isActionOf(MindStreamActions.nextFeedSuccess)),
    switchMap(({ payload: { feed, sourceUuid } }) => {
        if (state.value.mindStream.feeds.length === 1) {
            return of(
                (sourceUuid)
                    ? MindStreamActions.loadUnreadedFeedsBySource(sourceUuid)
                    : MindStreamActions.loadUnreadedFeeds(),
                MindStreamActions.goToNextFeed(sourceUuid)
            )
        } else {
            return of(MindStreamActions.goToNextFeed(sourceUuid))
        }
    })
)

const readFeedEpic: EpicType = (action$, state, dependencies) => action$.pipe(
    filter(isActionOf(MindStreamActions.readFeed)),
    mergeMap(({ payload: { feed, reaction, sourceUuid } }) => dependencies.api.feedReaction(state.value.auth.token)(feed, reaction).pipe(
        map(updatedFeed => MindStreamActions.nextFeedSuccess(updatedFeed, updatedFeed.rss_source_uuid)),
        catchError((error: ApiError) => of(MindStreamActions.mindstreamApiError(error)))
    ))
)

export const mindstreamEpics = combineEpics(
    loadUnreadedFeedsEpic,
    loadUnreadedFeedsBySourceEpic,
    nextFeedEpic,
    reloadUnreadedFeedsEpic,
    readFeedEpic,
)
