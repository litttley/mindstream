import { getType } from "typesafe-actions"
import { Actions } from "Actions"
import { MindstreamActions } from "mindstream/MindstreamActions"
import { RssFeedsResponse } from "services/RssFeedsResponse"

export interface MindStreamState {
  previusFeeds: RssFeedsResponse[]
  feeds: RssFeedsResponse[]
  nextFeedLoader: boolean
  likedLoading: boolean
  loading: boolean
  getFeedLoading: boolean
}

const initState: MindStreamState = {
  previusFeeds: [],
  feeds: [],
  nextFeedLoader: false,
  loading: false,
  likedLoading: false,
  getFeedLoading: false,
}

const MindStreamReducer = (state: MindStreamState = initState, action: Actions) => {
  switch (action.type) {
    case getType(MindstreamActions.mindstreamApiError): return { ...state, loading: false, nextFeedLoader: false }
    case getType(MindstreamActions.loadUnreadedFeeds.request): return { ...state, loading: true }
    case getType(MindstreamActions.loadUnreadedFeeds.success): return { ...state, feeds: action.payload, loading: false }
    case getType(MindstreamActions.loadUnreadedFeedsBySource.request): return { ...state, loading: true }
    case getType(MindstreamActions.loadUnreadedFeedsBySource.success): return { ...state, feeds: action.payload, loading: false }
    case getType(MindstreamActions.nextFeed.request): return { ...state, nextFeedLoader: true }
    case getType(MindstreamActions.nextFeed.success): return { ...state, nextFeedLoader: false }
    case getType(MindstreamActions.getFeed.request): return { ...state, getFeedLoading: true }
    case getType(MindstreamActions.getFeed.success): return { ...state, getFeedLoading: false }
    case getType(MindstreamActions.getFeed.failure): return { ...state, getFeedLoading: false }
    case getType(MindstreamActions.like.request): return { ...state, likedLoading: true }
    case getType(MindstreamActions.like.success): return { ...state, likedLoading: false, feeds: state.feeds.map(feed => {
      if (feed.rss_feed.uuid === action.payload.feed_uuid) {
        return { ...feed, user_rss_feed: action.payload }
      } else {
        return feed
      }
    }) }
    case getType(MindstreamActions.like.failure): return { ...state, likedLoading: false }
    case getType(MindstreamActions.goToNextFeed): {
      const [first, ...rest] = state.feeds
      return { ...state, feeds: rest, previusFeeds: [first, ...state.previusFeeds.slice(0, 10)] }
    }
    case getType(MindstreamActions.previousFeed): {
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
