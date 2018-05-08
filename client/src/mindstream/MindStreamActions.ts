import { buildAction, ActionsUnion } from "typesafe-actions"
import { RssFeed, Reaction } from "models/RssFeed"
import { ApiError } from "services/ApiError"

export const MindStreamActions = {
    mindstreamApiError: buildAction("MindStreamApiError").payload<{ error: ApiError }>(),
    goToNextFeed: buildAction("GoToNextFeed").empty(),
    nextFeed: buildAction("NextFeed").payload<{ feed: RssFeed, sourceUuid?: string }>(),
    nextFeedSuccess: buildAction("NextFeedSuccess").payload<{ feed: RssFeed, sourceUuid?: string }>(),
    previousFeed: buildAction("PreviousFeed").payload<{ sourceUuid?: string }>(),
    loadUnreadedFeeds: buildAction("LoadUnreadedFeeds").empty(),
    loadUnreadedFeedsSuccess: buildAction("LoadUnreadedFeedsSuccess").payload<{ feeds: RssFeed[] }>(),
    readFeed: buildAction("ReadFeed").payload<{ feed: RssFeed, reaction: Reaction, sourceUuid?: string }>(),
    loadUnreadedFeedsBySource: buildAction("LoadUnreadedFeedsBySource").payload<{ sourceUuid: string }>(),
    loadUnreadedFeedsBySourceSuccess: buildAction("LoadUnreadedFeedsBySourceSuccess").payload<{ feeds: RssFeed[] }>(),
}

export type MindStreamAction = ActionsUnion<typeof MindStreamActions>
