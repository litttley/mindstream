import { getType } from "typesafe-actions"
import { RssSource } from "models/RssSource"
import { SourcesActions } from "./SourcesActions"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"

export interface SourcesState {
    sources: RssSource[]
    mySources: RssSource[]
    loading: boolean
    error?: ApiError
    newSourceUrl: string
    addSourceLoading: boolean
}

const initState: SourcesState = {
    sources: [],
    mySources: [],
    loading: false,
    error: undefined,
    newSourceUrl: "",
    addSourceLoading: false,
}

const SourcesReducer = (state: SourcesState = initState, action: Actions) => {
    switch (action.type) {
        case getType(SourcesActions.addSourceOnChange): return { ...state, [action.payload.field]: action.payload.value }

        case getType(SourcesActions.addSource): return { ...state, addSourceLoading: true }
        case getType(SourcesActions.addSourceSuccess): return {
            ...state,
            addSourceLoading: false,
            newSourceUrl: "",
            sources: [...state.sources, action.payload.source]
        }
        case getType(SourcesActions.addSourceError): return { ...state, addSourceLoading: false, error: action.payload.error }

        case getType(SourcesActions.loadUnfollowedSources): return { ...state, loading: true }
        case getType(SourcesActions.loadUnfollowedSourcesSuccess): return { ...state, sources: action.payload.sources, loading: false }
        case getType(SourcesActions.loadUnfollowedSourcesError): return { ...state, loading: false, error: action.payload.error }

        case getType(SourcesActions.loadMySources): return { ...state, loading: true }
        case getType(SourcesActions.loadMySourcesSuccess): return { ...state, mySources: action.payload.sources, loading: false }
        case getType(SourcesActions.loadMySourcesError): return { ...state, loading: false, error: action.payload.error }

        case getType(SourcesActions.addMySource): return { ...state, mySources: [...state.mySources, action.payload.source] }

        case getType(SourcesActions.fallowSources): return { ...state, loading: true}
        case getType(SourcesActions.fallowSourcesError): return { ...state, loading: false, error: action.payload.error }
        case getType(SourcesActions.fallowSourcesSuccess): return {
            ...state,
            sources: state.sources.filter(source => source.uuid !== action.payload.source.uuid),
            loading: false
        }
        default: return state
    }
}

export default SourcesReducer
