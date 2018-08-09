import { getType } from "typesafe-actions"
import { FeedsActions } from "./FeedsActions"
import { RssFeed } from "models/RssFeed"
import { Actions } from "Actions"
import { ApiErrors } from "services/ApiError"

export interface FeedsState {
    feeds: RssFeed[]
    loading: boolean
    error?: ApiErrors
}

const initState: FeedsState = {
    feeds: [],
    loading: false,
    error: undefined,
}

const FeedsReducer = (state: FeedsState = initState, action: Actions) => {
    switch (action.type) {
        case getType(FeedsActions.loadfeeds): return { ...state, loading: true }
        case getType(FeedsActions.loadfeedsSuccess): return { ...state, feeds: action.payload.feeds, loading: false }
        case getType(FeedsActions.loadfeedsError): return { ...state, loading: false, error: action.payload.error }
        default: return state
    }
}

export default FeedsReducer
