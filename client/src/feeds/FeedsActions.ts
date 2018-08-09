import { createAction, ActionType } from "typesafe-actions"
import { RssFeed } from "models/RssFeed"
import { ApiErrors } from "services/ApiError"

export const FeedsActions = {
    loadfeeds: createAction("Loadfeeds"),
    loadfeedsSuccess: createAction("LoadfeedsSuccess", resolve => (feeds: RssFeed[]) => resolve({ feeds })),
    loadfeedsError: createAction("LoadfeedsError", resolve => (error: ApiErrors) => resolve({ error })),
}

export type FeedsAction = ActionType<typeof FeedsActions>
