import { getType } from "typesafe-actions"
import { RssSource, MyRssSource } from "~/models/RssSource"
import { SourcesActions } from "./SourcesActions"
import { Actions } from "~/Actions"
import { ApiErrors } from "~/services/ApiError"

export interface SourcesState {
  unfollowedRssSources: RssSource[]
  myRssSources: MyRssSource[]
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

    case getType(SourcesActions.addSource.request): return { ...state, addSourceLoading: true }
    case getType(SourcesActions.addSource.success): return {
      ...state,
      addSourceLoading: false,
      newSourceUrl: "",
      unfollowedRssSources: [...state.unfollowedRssSources, action.payload]
    }
    case getType(SourcesActions.addSource.failure): return { ...state, addSourceLoading: false, error: action.payload }

    case getType(SourcesActions.loadUnfollowedSources.request): return { ...state, loading: true }
    case getType(SourcesActions.loadUnfollowedSources.success): return {
      ...state,
      unfollowedRssSources: action.payload,
      loading: false
    }
    case getType(SourcesActions.loadUnfollowedSources.failure): return { ...state, loading: false, error: action.payload }

    case getType(SourcesActions.loadMySources.request): return { ...state, loading: true }
    case getType(SourcesActions.loadMySources.success): return { ...state, myRssSources: action.payload, loading: false }
    case getType(SourcesActions.loadMySources.failure): return { ...state, loading: false, error: action.payload }

    case getType(SourcesActions.addMySource): return { ...state, myRssSources: [
      ...state.myRssSources, { rss_source: action.payload, unreaded: 0 }
    ]}

    case getType(SourcesActions.fallowSources.request): return { ...state, loading: true}
    case getType(SourcesActions.fallowSources.success): return {
      ...state,
      unfollowedRssSources: state.unfollowedRssSources.filter(source => source.uuid !== action.payload.uuid),
      loading: false
    }
    case getType(SourcesActions.fallowSources.failure): return { ...state, loading: false, error: action.payload }
    default: return state
  }
}

export default SourcesReducer
