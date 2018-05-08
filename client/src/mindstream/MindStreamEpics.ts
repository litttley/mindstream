import { Epic, combineEpics } from "redux-observable"
import { Observable } from "rxjs/Observable"
import { isActionOf } from "typesafe-actions"

import { MindStreamActions, MindStreamAction } from "./MindStreamActions"
import { GlobalState, Dependencies } from "../app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"

type EpicType = Epic<Actions, GlobalState, Dependencies>

export const loadUnreadedFeedsEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(MindStreamActions.loadUnreadedFeeds))
        .mergeMap(() =>
            dependencies.api.loadUnreadedFeeds(state.getState().app.token as string)
                .map(feeds => MindStreamActions.loadUnreadedFeedsSuccess({ feeds }))
                .catch((error: ApiError) => Observable.of(MindStreamActions.mindstreamApiError({ error })))
        )
}

export const loadUnreadedFeedsBySourceEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(MindStreamActions.loadUnreadedFeedsBySource))
        .mergeMap(({ payload: { sourceUuid } }) =>
            dependencies.api.loadUnreadedFeedsBySource(state.getState().app.token as string)(sourceUuid)
                .map(feeds => MindStreamActions.loadUnreadedFeedsBySourceSuccess({ feeds }))
                .catch((error: ApiError) => Observable.of(MindStreamActions.mindstreamApiError({ error })))
        )
}

export const nextFeedEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(MindStreamActions.nextFeed))
        .mergeMap(({ payload: { feed, sourceUuid } }) =>
            dependencies.api.feedReaction(state.getState().app.token as string)(feed, "Readed")
                .map(updatedFeed => MindStreamActions.nextFeedSuccess({ feed: updatedFeed, sourceUuid }))
                .catch((error: ApiError) => Observable.of(MindStreamActions.mindstreamApiError({ error })))
        )
}

export const reloadUnreadedFeedsEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(MindStreamActions.nextFeedSuccess))
        .mergeMap(({ payload: { feed, sourceUuid } }) => {
            if (state.getState().mindStream.feeds.length === 1) {
                return Observable.of<MindStreamAction>(
                    (sourceUuid)
                    ? MindStreamActions.loadUnreadedFeedsBySource({ sourceUuid })
                    : MindStreamActions.loadUnreadedFeeds(),
                    MindStreamActions.goToNextFeed()
                )
            } else {
                return Observable.of(MindStreamActions.goToNextFeed())
            }
        })
}

export const readFeedEpic: EpicType = (action$, state, dependencies) => {
    return action$
        .filter(isActionOf(MindStreamActions.readFeed))
        .mergeMap(({ payload: { feed, reaction, sourceUuid } }) =>
            dependencies.api.feedReaction(state.getState().app.token as string)(feed, reaction)
                .map(updatedFeed => MindStreamActions.nextFeedSuccess({ feed: updatedFeed, sourceUuid }))
                .catch((error: ApiError) => Observable.of(MindStreamActions.mindstreamApiError({ error })))
        )
}

export const mindstreamEpics = combineEpics(
    loadUnreadedFeedsEpic,
    loadUnreadedFeedsBySourceEpic,
    nextFeedEpic,
    reloadUnreadedFeedsEpic,
    readFeedEpic,
)
