import { createAction, createAsyncAction, ActionType } from "typesafe-actions"
import { RssFeed, Reaction } from "models/RssFeed"
import { ApiErrors } from "services/ApiError"

type NextFeedPayload = {
  feed: RssFeed,
  sourceUuid?: string
}

export const MindStreamActions = {
  nextFeed: createAsyncAction("NextFeedRequest", "NextFeedSuccess", "NextFeedFailure")<NextFeedPayload, NextFeedPayload, ApiErrors>(),
  mindstreamApiError: createAction("MindStreamApiError", resolve => (error: ApiErrors) => resolve({ error })),
  goToNextFeed: createAction("GoToNextFeed", resolve => (sourceUuid: string | undefined) => resolve({ sourceUuid })),
  previousFeed: createAction("PreviousFeed", resolve => (sourceUuid?: string) => resolve({ sourceUuid })),
  loadUnreadedFeeds: createAction("LoadUnreadedFeeds"),
  loadUnreadedFeedsSuccess: createAction("LoadUnreadedFeedsSuccess", resolve => (feeds: RssFeed[]) => resolve({ feeds })),
  readFeed: createAction("ReadFeed",
    resolve => (feed: RssFeed, reaction: Reaction, sourceUuid?: string) => resolve({ feed, reaction, sourceUuid })
  ),
  loadUnreadedFeedsBySource: createAction("LoadUnreadedFeedsBySource", resolve => (sourceUuid: string) => resolve({ sourceUuid })),
  loadUnreadedFeedsBySourceSuccess: createAction("LoadUnreadedFeedsBySourceSuccess", resolve => (feeds: RssFeed[]) => resolve({ feeds })),
}

export type MindStreamAction = ActionType<typeof MindStreamActions>
