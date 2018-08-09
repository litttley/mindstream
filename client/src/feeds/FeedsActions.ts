import { createAsyncAction, ActionType } from "typesafe-actions"
import { RssFeed } from "models/RssFeed"
import { ApiErrors } from "services/ApiError"

export const FeedsActions = {
  loadfeeds: createAsyncAction("LoadfeedsRequest", "LoadfeedsSuccess", "LoadfeedsFailure")<void, RssFeed[], ApiErrors>(),
}

export type FeedsAction = ActionType<typeof FeedsActions>
