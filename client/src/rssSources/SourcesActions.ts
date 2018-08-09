import { createAction, createAsyncAction, createStandardAction, ActionType } from "typesafe-actions"
import { RssSource, MyRssSources } from "models/RssSource"
import { ApiErrors } from "services/ApiError"

export const SourcesActions = {
  loadUnfollowedSources: createAsyncAction(
    "LoadUnfollowedSourcesRequest", "LoadUnfollowedSourcesSuccess", "LoadUnfollowedSourcesFailure"
  )<void, RssSource[], ApiErrors>(),
  loadMySources: createAsyncAction(
    "LoadMySourcesRequest", "LoadMySourcesSuccess", "LoadMySourcesFailure"
  )<void, MyRssSources[], ApiErrors>(),
  fallowSources: createAsyncAction(
    "FallowSourcesRequest", "FallowSourcesSuccess", "FallowSourcesFailure"
  )<RssSource, RssSource, ApiErrors>(),
  addSource: createAsyncAction(
    "AddSourceRequest", "AddSourceSuccess", "AddSourceFailure"
  )<string, RssSource, ApiErrors>(),
  addSourceOnChange: createAction("AddSourceOnChange", resolve => (field: string, value: string) => resolve({ field, value })),
  addMySource: createStandardAction("AddMySource")<RssSource>(),
}

export type SourcesAction = ActionType<typeof SourcesActions>
