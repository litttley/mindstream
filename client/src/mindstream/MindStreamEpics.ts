import { combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of } from "rxjs"
import { filter, switchMap, mergeMap, map, catchError } from "rxjs/operators"

import { MindstreamActions } from "~/mindstream/MindstreamActions"
import { ApiErrors } from "~/services/ApiError"
import { EpicType } from "~/RootEpic"

const loadUnreadedFeedsEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindstreamActions.loadUnreadedFeeds.request)),
  switchMap(() => api.getRssFeeds(state.value.app.token, "Unreaded").pipe(
    map(MindstreamActions.loadUnreadedFeeds.success),
    catchError((error: ApiErrors) => of(MindstreamActions.mindstreamApiError(error)))
  ))
)

const loadUnreadedFeedsBySourceEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindstreamActions.loadUnreadedFeedsBySource.request)),
  switchMap(({ payload }) => api.getRssFeeds(state.value.app.token, "Unreaded", payload).pipe(
    map(MindstreamActions.loadUnreadedFeedsBySource.success),
    catchError((error: ApiErrors) => of(MindstreamActions.mindstreamApiError(error)))
  ))
)

const nextFeedEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindstreamActions.nextFeed.request)),
  switchMap(({ payload: { feed, sourceUuid } }) => api.feedReaction(state.value.app.token)(feed, "Readed").pipe(
    map(() => MindstreamActions.nextFeed.success({ feed, sourceUuid })),
    catchError((error: ApiErrors) => of(MindstreamActions.mindstreamApiError(error)))
  ))
)

const likeEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindstreamActions.like.request)),
  switchMap(({ payload }) => api.feedReaction(state.value.app.token)(payload, "Liked").pipe(
    map(updatedFeed => MindstreamActions.like.success(updatedFeed)),
    catchError((error: ApiErrors) => of(MindstreamActions.mindstreamApiError(error)))
  ))
)

const reloadUnreadedFeedsEpic: EpicType = (action$, state, { api }) => action$.pipe(
  filter(isActionOf(MindstreamActions.nextFeed.success)),
  switchMap(({ payload: { feed, sourceUuid } }) => {
    if (state.value.mindStream.feeds.length === 1) {
      return of(
        (sourceUuid)
          ? MindstreamActions.loadUnreadedFeedsBySource.request(sourceUuid)
          : MindstreamActions.loadUnreadedFeeds.request(),
        MindstreamActions.goToNextFeed(sourceUuid)
      )
    } else {
      return of(MindstreamActions.goToNextFeed(sourceUuid))
    }
  })
)

const readFeedEpic: EpicType = (action$, state, dependencies) => action$.pipe(
  filter(isActionOf(MindstreamActions.readFeed)),
  mergeMap(({ payload: { feed, reaction, sourceUuid } }) => dependencies.api.feedReaction(state.value.app.token)(feed, reaction).pipe(
    map(() => MindstreamActions.nextFeed.success({ feed, sourceUuid})),
    catchError((error: ApiErrors) => of(MindstreamActions.mindstreamApiError(error)))
  ))
)

const getFeedEpic: EpicType = action$ => action$.pipe(
  filter(isActionOf(MindstreamActions.getFeed.request)),
  map(() => MindstreamActions.getFeed.success(undefined))
)

export const mindstreamEpics = combineEpics(
  loadUnreadedFeedsEpic,
  loadUnreadedFeedsBySourceEpic,
  nextFeedEpic,
  reloadUnreadedFeedsEpic,
  readFeedEpic,
  likeEpic,
  getFeedEpic,
)
