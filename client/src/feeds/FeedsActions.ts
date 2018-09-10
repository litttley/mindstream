import { createAsyncAction, ActionType } from "typesafe-actions"
import { ApiErrors } from "services/ApiError"
import { RssFeedsResponse } from "services/RssFeedsResponse"

export const FeedsActions = {
  loadfeeds: createAsyncAction("LoadfeedsRequest", "LoadfeedsSuccess", "LoadfeedsFailure")<void, RssFeedsResponse[], ApiErrors>(),
}

export type FeedsAction = ActionType<typeof FeedsActions>
