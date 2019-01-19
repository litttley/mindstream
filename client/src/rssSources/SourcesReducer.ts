import { getType } from "typesafe-actions"

import { RssSource, MyRssSource } from "~/models/RssSource"
import { SourcesActions } from "./SourcesActions"
import { Actions } from "~/Actions"
import { ApiErrors } from "~/services/ApiError"

export interface SourcesState {
  rssSources: RssSource[]
  searchRssSourceLoading: boolean
  myRssSources: MyRssSource[]
  loading: boolean
  error?: ApiErrors
}

const initState: SourcesState = {
  rssSources: [],
  searchRssSourceLoading: false,
  myRssSources: [],
  loading: false,
  error: undefined,
}

const SourcesReducer = (state: SourcesState = initState, action: Actions): SourcesState => {
  switch (action.type) {
    case getType(SourcesActions.searchRssSources.request): return { ...state, searchRssSourceLoading: true }
    case getType(SourcesActions.searchRssSources.success): return { ...state, rssSources: action.payload, searchRssSourceLoading: false }
    case getType(SourcesActions.searchRssSources.failure): return { ...state, error: action.payload, searchRssSourceLoading: false }
    case getType(SourcesActions.loadMySources.request): return { ...state, loading: true }
    case getType(SourcesActions.loadMySources.success): return { ...state, myRssSources: action.payload, loading: false }
    case getType(SourcesActions.loadMySources.failure): return { ...state, loading: false, error: action.payload }
    case getType(SourcesActions.addMySource): return { ...state, myRssSources: [
      ...state.myRssSources, { rss_source: action.payload, unreaded: 0 }
    ]}
    case getType(SourcesActions.fallowSources.request): return { ...state, loading: true }
    case getType(SourcesActions.fallowSources.success): return { ...state, loading: false }
    case getType(SourcesActions.fallowSources.failure): return { ...state, loading: false, error: action.payload }
    default: return state
  }
}

export default SourcesReducer
