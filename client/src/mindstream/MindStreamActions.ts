import { createAction, ActionType } from "typesafe-actions"
import { RssFeed, Reaction } from "models/RssFeed"
import { ApiErrors } from "services/ApiError"

export const MindStreamActions = {
    mindstreamApiError: createAction("MindStreamApiError", resolve => (error: ApiErrors) => resolve({ error })),
    goToNextFeed: createAction("GoToNextFeed", resolve => (sourceUuid: string | undefined) => resolve({ sourceUuid })),
    nextFeed: createAction("NextFeed", resolve => (feed: RssFeed, sourceUuid?: string) => resolve({ feed, sourceUuid })),
    nextFeedSuccess: createAction("NextFeedSuccess", resolve => (feed: RssFeed, sourceUuid?: string) => resolve({ feed, sourceUuid })),
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
