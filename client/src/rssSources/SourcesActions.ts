import { createAction, ActionType } from "typesafe-actions"
import { RssSource, MyRssSources } from "models/RssSource"
import { ApiErrors } from "services/ApiError"

export const SourcesActions = {
    loadUnfollowedSources: createAction("LoadUnfollowedSources"),
    loadUnfollowedSourcesSuccess: createAction("LoadUnfollowedSourcesSuccess",
        resolve => (unfollowedRssSources: RssSource[]) => resolve({ unfollowedRssSources })
    ),
    loadUnfollowedSourcesError: createAction("LoadUnfollowedSourcesError", resolve => (error: ApiErrors) => resolve({ error })),
    loadMySources: createAction("LoadMySources"),
    loadMySourcesSuccess: createAction("LoadMySourcesSuccess", resolve => (myRssSources: MyRssSources[]) => resolve({ myRssSources })),
    loadMySourcesError: createAction("LoadMySourcesError", resolve => (error: ApiErrors) => resolve({ error })),
    addMySource: createAction("AddMySource", resolve => (source: RssSource) => resolve({ source })),
    fallowSources: createAction("FallowSources", resolve => (source: RssSource) => resolve({ source })),
    fallowSourcesSuccess: createAction("FallowSourcesSuccess", resolve => (source: RssSource) => resolve({ source })),
    fallowSourcesError: createAction("FallowSourcesError", resolve => (error: ApiErrors) => resolve({ error })),
    addSourceOnChange: createAction("AddSourceOnChange", resolve => (field: string, value: string) => resolve({ field, value })),
    addSource: createAction("AddSource", resolve => (sourceUrl: string) => resolve({ sourceUrl })),
    addSourceSuccess: createAction("AddSourceSuccess", resolve => (source: RssSource) => resolve({ source })),
    addSourceError: createAction("AddSourceError", resolve => (error: ApiErrors) => resolve({ error })),
}

export type SourcesAction = ActionType<typeof SourcesActions>
