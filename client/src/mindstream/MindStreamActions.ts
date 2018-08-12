import { createAsyncAction, createStandardAction, ActionType } from "typesafe-actions"
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
  goToNextFeed: createStandardAction("GoToNextFeed")<string | undefined>(),
  mindstreamApiError: createStandardAction("MindStreamApiError")<ApiErrors>(),
  previousFeed: createStandardAction("PreviousFeed")<string | undefined>(),
  readFeed: createStandardAction("ReadFeed")<{ feed: RssFeed, reaction: Reaction, sourceUuid?: string }>(),
}

export type MindStreamAction = ActionType<typeof MindStreamActions>
