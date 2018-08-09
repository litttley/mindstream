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
  addMySource: createStandardAction("AddMySource")<RssSource>(),
  addSourceOnChange: createAction("AddSourceOnChange", resolve => (field: string, value: string) => resolve({ field, value })),
  addSource: createAction("AddSource", resolve => (sourceUrl: string) => resolve({ sourceUrl })),
  addSourceSuccess: createAction("AddSourceSuccess", resolve => (source: RssSource) => resolve({ source })),
  addSourceError: createAction("AddSourceError", resolve => (error: ApiErrors) => resolve({ error })),
}

export type SourcesAction = ActionType<typeof SourcesActions>
