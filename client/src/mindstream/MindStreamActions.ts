import { createAsyncAction, createStandardAction, ActionType } from "typesafe-actions"
import { RssFeed, Reaction, UserRssFeed } from "models/RssFeed"
import { ApiErrors } from "services/ApiError"
import { RssFeedsResponse } from "services/RssFeedsResponse"

type NextFeedPayload = {
  feed: RssFeed,
  sourceUuid?: string
}

type ReactionPayload = {
  feed: RssFeed,
  reaction: Reaction,
  sourceUuid?: string
}

export const MindstreamActions = {
  like: createAsyncAction("LikeRequest", "LikeSuccess", "LikeFailure")<RssFeed, UserRssFeed, ApiErrors>(),
  getFeed: createAsyncAction("GetFeedRequest", "GetFeedSuccess", "GetFeedFailure")<string, RssFeedsResponse | undefined, ApiErrors>(),
  nextFeed: createAsyncAction("NextFeedRequest", "NextFeedSuccess", "NextFeedFailure")<NextFeedPayload, NextFeedPayload, ApiErrors>(),
  loadUnreadedFeeds: createAsyncAction(
    "LoadUnreadedFeedsRequest", "LoadUnreadedFeedsSuccess", "LoadUnreadedFeedsFailure"
  )<void, RssFeedsResponse[], ApiErrors>(),
  loadUnreadedFeedsBySource: createAsyncAction(
    "LoadUnreadedFeedsBySourceRequest", "LoadUnreadedFeedsBySourceSuccess", "LoadUnreadedFeedsBySourceFailure"
  )<string, RssFeedsResponse[], ApiErrors>(),
  goToNextFeed: createStandardAction("GoToNextFeed")<string | undefined>(),
  mindstreamApiError: createStandardAction("MindStreamApiError")<ApiErrors>(),
  previousFeed: createStandardAction("PreviousFeed")<string | undefined>(),
  readFeed: createStandardAction("ReadFeed")<ReactionPayload>(),
}

export type MindstreamAction = ActionType<typeof MindstreamActions>
