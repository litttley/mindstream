import { buildAction, ActionsUnion } from "typesafe-actions"
import { RssSource } from "models/RssSource"
import { ApiError } from "services/ApiError"

export const SourcesActions = {
    loadUnfollowedSources: buildAction("LoadUnfollowedSources").empty(),
    loadUnfollowedSourcesSuccess: buildAction("LoadUnfollowedSourcesSuccess").payload<{ sources: RssSource[] }>(),
    loadUnfollowedSourcesError: buildAction("LoadUnfollowedSourcesError").payload<{ error: ApiError }>(),
    loadMySources: buildAction("LoadMySources").empty(),
    loadMySourcesSuccess: buildAction("LoadMySourcesSuccess").payload<{ sources: RssSource[] }>(),
    loadMySourcesError: buildAction("LoadMySourcesError").payload<{ error: ApiError }>(),
    addMySource: buildAction("AddMySource").payload<{ source: RssSource }>(),
    fallowSources: buildAction("FallowSources").payload<{ source: RssSource }>(),
    fallowSourcesSuccess: buildAction("FallowSourcesSuccess").payload<{ source: RssSource }>(),
    fallowSourcesError: buildAction("FallowSourcesError").payload<{ error: ApiError }>(),
    addSourceOnChange: buildAction("AddSourceOnChange").payload<{ field: string, value: string }>(),
    addSource: buildAction("AddSource").payload<{ sourceUrl: string }>(),
    addSourceSuccess: buildAction("AddSourceSuccess").payload<{ source: RssSource }>(),
    addSourceError: buildAction("AddSourceError").payload<{ error: ApiError }>(),
}

export type SourcesAction = ActionsUnion<typeof SourcesActions>
