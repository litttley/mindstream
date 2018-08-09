import { getType } from "typesafe-actions"
import { FeedsActions } from "./FeedsActions"
import { RssFeed } from "models/RssFeed"
import { Actions } from "Actions"
import { ApiErrors } from "services/ApiError"

export interface FeedsState {
  feeds: RssFeed[]
  loading: boolean
  errors?: ApiErrors
}

const initState: FeedsState = {
  feeds: [],
  loading: false,
  errors: undefined,
}

const FeedsReducer = (state: FeedsState = initState, action: Actions): FeedsState => {
  switch (action.type) {
    case getType(FeedsActions.loadfeeds.request): return { ...state, loading: true }
    case getType(FeedsActions.loadfeeds.success): return { ...state, feeds: action.payload, loading: false }
    case getType(FeedsActions.loadfeeds.failure): return { ...state, loading: false, errors: action.payload }
    default: return state
  }
}

export default FeedsReducer
