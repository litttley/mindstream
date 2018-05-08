import { buildAction, ActionsUnion } from "typesafe-actions"
import { RssFeed } from "models/RssFeed"
import { ApiError } from "services/ApiError"

export const FeedsActions = {
    loadfeeds: buildAction("Loadfeeds").empty(),
    loadfeedsSuccess: buildAction("LoadfeedsSuccess").payload<{ feeds: RssFeed[] }>(),
    loadfeedsError: buildAction("LoadfeedsError").payload<{ error: ApiError }>(),
}

export type FeedsAction = ActionsUnion<typeof FeedsActions>
