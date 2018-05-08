import { getType } from "typesafe-actions"
import { Actions } from "Actions"
import { MindStreamActions } from "./MindStreamActions"
import { RssFeed } from "models/RssFeed"

export interface MindStreamState {
    previusFeeds: RssFeed[]
    feeds: RssFeed[]
    nextFeedLoader: boolean
    loading: boolean
}

const initState: MindStreamState = {
    previusFeeds: [],
    feeds: [],
    nextFeedLoader: false,
    loading: false,
}

const MindStreamReducer = (state: MindStreamState = initState, action: Actions) => {
    switch (action.type) {
        case getType(MindStreamActions.mindstreamApiError): return { ...state, loading: false, nextFeedLoader: false }
        case getType(MindStreamActions.loadUnreadedFeeds): return { ...state, loading: true }
        case getType(MindStreamActions.loadUnreadedFeedsSuccess): return { ...state, feeds: action.payload.feeds, loading: false }
        case getType(MindStreamActions.loadUnreadedFeedsBySource): return { ...state, loading: true }
        case getType(MindStreamActions.loadUnreadedFeedsBySourceSuccess): return { ...state, feeds: action.payload.feeds, loading: false }
        case getType(MindStreamActions.nextFeed): return { ...state, nextFeedLoader: true }
        case getType(MindStreamActions.nextFeedSuccess): return { ...state, nextFeedLoader: false }
        case getType(MindStreamActions.goToNextFeed): {
            const [first, ...rest] = state.feeds
            return { ...state, feeds: rest, previusFeeds: [first, ...state.previusFeeds.slice(0, 10)] }
        }
        case getType(MindStreamActions.previousFeed): {
            const [first, ...rest] = state.previusFeeds
            if (first) {
                return { ...state, feeds: [first, ...state.feeds], previusFeeds: rest }
            } else {
                return state
            }
        }
        default: return state
    }
}

export default MindStreamReducer
