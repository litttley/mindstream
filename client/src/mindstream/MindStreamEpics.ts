import { Epic, combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of } from "rxjs"
import { filter, switchMap, mergeMap, map, catchError } from "rxjs/operators"

import { MindStreamActions } from "./MindStreamActions"
import { GlobalState, Dependencies } from "../app/AppState"
import { Actions } from "Actions"
import { ApiErrors } from "services/ApiError"

type EpicType = Epic<Actions, Actions, GlobalState, Dependencies>

const loadUnreadedFeedsEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindStreamActions.loadUnreadedFeeds.request)),
  switchMap(() => api.getRssFeeds(state.value.app.token, "Unreaded").pipe(
    map(MindStreamActions.loadUnreadedFeeds.success),
    catchError((error: ApiErrors) => of(MindStreamActions.mindstreamApiError(error)))
  ))
)

const loadUnreadedFeedsBySourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindStreamActions.loadUnreadedFeedsBySource.request)),
  switchMap(({ payload }) => api.getRssFeeds(state.value.app.token, "Unreaded", payload).pipe(
    map(MindStreamActions.loadUnreadedFeedsBySource.success),
    catchError((error: ApiErrors) => of(MindStreamActions.mindstreamApiError(error)))
  ))
)

const nextFeedEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindStreamActions.nextFeed.request)),
  switchMap(({ payload: { feed, sourceUuid } }) => api.feedReaction(state.value.app.token)(feed, "Readed").pipe(
    map(updatedFeed => MindStreamActions.nextFeed.success({ feed: updatedFeed, sourceUuid: updatedFeed.rss_source_uuid })),
    catchError((error: ApiErrors) => of(MindStreamActions.mindstreamApiError(error)))
  ))
)

const reloadUnreadedFeedsEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindStreamActions.nextFeed.success)),
  switchMap(({ payload: { feed, sourceUuid } }) => {
    if (state.value.mindStream.feeds.length === 1) {
      return of(
        (sourceUuid)
          ? MindStreamActions.loadUnreadedFeedsBySource.request(sourceUuid)
          : MindStreamActions.loadUnreadedFeeds.request(),
        MindStreamActions.goToNextFeed(sourceUuid)
      )
    } else {
      return of(MindStreamActions.goToNextFeed(sourceUuid))
    }
  })
)

const readFeedEpic: EpicType = (action$, state, dependencies) => action$.pipe(
  filter(isActionOf(MindStreamActions.readFeed)),
  mergeMap(({ payload: { feed, reaction, sourceUuid } }) => dependencies.api.feedReaction(state.value.app.token)(feed, reaction).pipe(
    map(updatedFeed => MindStreamActions.nextFeed.success({ feed: updatedFeed, sourceUuid: updatedFeed.rss_source_uuid})),
    catchError((error: ApiErrors) => of(MindStreamActions.mindstreamApiError(error)))
  ))
)

export const mindstreamEpics = combineEpics(
  loadUnreadedFeedsEpic,
  loadUnreadedFeedsBySourceEpic,
  nextFeedEpic,
  reloadUnreadedFeedsEpic,
  readFeedEpic,
)
