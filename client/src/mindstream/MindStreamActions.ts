import { createAction, createAsyncAction, ActionType } from "typesafe-actions"
import { RssFeed, Reaction } from "models/RssFeed"
import { ApiErrors } from "services/ApiError"

type NextFeedPayload = {
  feed: RssFeed,
  sourceUuid?: string
}

export const MindStreamActions = {
  nextFeed: createAsyncAction("NextFeedRequest", "NextFeedSuccess", "NextFeedFailure")<NextFeedPayload, NextFeedPayload, ApiErrors>(),
  loadUnreadedFeeds: createAsyncAction(
    "LoadUnreadedFeedsRequest", "LoadUnreadedFeedsSuccess", "LoadUnreadedFeedsFailure"
  )<void, RssFeed[], ApiErrors>(),
  loadUnreadedFeedsBySource: createAsyncAction(
    "LoadUnreadedFeedsBySourceRequest", "LoadUnreadedFeedsBySourceSuccess", "LoadUnreadedFeedsBySourceFailure"
  )<string, RssFeed[], ApiErrors>(),

  mindstreamApiError: createAction("MindStreamApiError", resolve => (error: ApiErrors) => resolve({ error })),
  goToNextFeed: createAction("GoToNextFeed", resolve => (sourceUuid: string | undefined) => resolve({ sourceUuid })),
  previousFeed: createAction("PreviousFeed", resolve => (sourceUuid?: string) => resolve({ sourceUuid })),
  readFeed: createAction("ReadFeed",
    resolve => (feed: RssFeed, reaction: Reaction, sourceUuid?: string) => resolve({ feed, reaction, sourceUuid })
  ),
}

export type MindStreamAction = ActionType<typeof MindStreamActions>
