import { createAsyncAction, createStandardAction, ActionType } from "typesafe-actions"
import { RssSource, MyRssSource } from "~/models/RssSource"
import { ApiErrors } from "~/services/ApiError"

export const SourcesActions = {
  loadMySources: createAsyncAction(
    "LoadMySourcesRequest", "LoadMySourcesSuccess", "LoadMySourcesFailure"
  )<void, MyRssSource[], ApiErrors>(),
  fallowSources: createAsyncAction(
    "FallowSourcesRequest", "FallowSourcesSuccess", "FallowSourcesFailure"
  )<RssSource, RssSource, ApiErrors>(),
  searchRssSources: createAsyncAction(
    "SearchRssSourcesRequest",
    "SearchRssSourcesSuccess",
    "SearchRssSourcesFailure"
  )<string, RssSource[], ApiErrors>(),
  addMySource: createStandardAction("AddMySource")<RssSource>(),
}

export type SourcesAction = ActionType<typeof SourcesActions>
