import { getType } from "typesafe-actions"
import { RssSource, MyRssSources } from "models/RssSource"
import { SourcesActions } from "./SourcesActions"
import { Actions } from "Actions"
import { ApiErrors } from "services/ApiError"

export interface SourcesState {
    unfollowedRssSources: RssSource[]
    myRssSources: MyRssSources[]
    loading: boolean
    error?: ApiErrors
    newSourceUrl: string
    addSourceLoading: boolean
}

const initState: SourcesState = {
    unfollowedRssSources: [],
    myRssSources: [],
    loading: false,
    error: undefined,
    newSourceUrl: "",
    addSourceLoading: false,
}

const SourcesReducer = (state: SourcesState = initState, action: Actions): SourcesState => {
    switch (action.type) {
        case getType(SourcesActions.addSourceOnChange): return { ...state, [action.payload.field]: action.payload.value }

        case getType(SourcesActions.addSource): return { ...state, addSourceLoading: true }
        case getType(SourcesActions.addSourceSuccess): return {
            ...state,
            addSourceLoading: false,
            newSourceUrl: "",
            unfollowedRssSources: [...state.unfollowedRssSources, action.payload.source]
        }
        case getType(SourcesActions.addSourceError): return { ...state, addSourceLoading: false, error: action.payload.error }

        case getType(SourcesActions.loadUnfollowedSources): return { ...state, loading: true }
        case getType(SourcesActions.loadUnfollowedSourcesSuccess): return {
            ...state,
            unfollowedRssSources: action.payload.unfollowedRssSources,
            loading: false
        }
        case getType(SourcesActions.loadUnfollowedSourcesError): return { ...state, loading: false, error: action.payload.error }

        case getType(SourcesActions.loadMySources): return { ...state, loading: true }
        case getType(SourcesActions.loadMySourcesSuccess): return { ...state, myRssSources: action.payload.myRssSources, loading: false }
        case getType(SourcesActions.loadMySourcesError): return { ...state, loading: false, error: action.payload.error }

        case getType(SourcesActions.addMySource): return { ...state, myRssSources: [
            ...state.myRssSources, { rss_source: action.payload.source, unreaded: 0 }
        ]}

        case getType(SourcesActions.fallowSources): return { ...state, loading: true}
        case getType(SourcesActions.fallowSourcesError): return { ...state, loading: false, error: action.payload.error }
        case getType(SourcesActions.fallowSourcesSuccess): return {
            ...state,
            unfollowedRssSources: state.unfollowedRssSources.filter(source => source.uuid !== action.payload.source.uuid),
            loading: false
        }
        default: return state
    }
}

export default SourcesReducer
