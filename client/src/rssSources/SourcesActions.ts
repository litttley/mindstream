import { createAsyncAction, createStandardAction, ActionType } from "typesafe-actions"
import { RssSource, MyRssSource } from "~/models/RssSource"
import { ApiErrors } from "~/services/ApiError"

export const SourcesActions = {
  loadUnfollowedSources: createAsyncAction(
    "LoadUnfollowedSourcesRequest", "LoadUnfollowedSourcesSuccess", "LoadUnfollowedSourcesFailure"
  )<void, RssSource[], ApiErrors>(),
  loadMySources: createAsyncAction(
    "LoadMySourcesRequest", "LoadMySourcesSuccess", "LoadMySourcesFailure"
  )<void, MyRssSource[], ApiErrors>(),
  fallowSources: createAsyncAction(
    "FallowSourcesRequest", "FallowSourcesSuccess", "FallowSourcesFailure"
  )<RssSource, RssSource, ApiErrors>(),
  addSource: createAsyncAction(
    "AddSourceRequest", "AddSourceSuccess", "AddSourceFailure"
  )<string, RssSource, ApiErrors>(),
  addSourceOnChange: createStandardAction("AddSourceOnChange")<{ field: string, value: string }>(),
  addMySource: createStandardAction("AddMySource")<RssSource>(),
}

export type SourcesAction = ActionType<typeof SourcesActions>
