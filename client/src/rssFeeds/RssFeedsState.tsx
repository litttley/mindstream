import * as React from "react"
import { createStore } from "~/Store"
import { api } from "~/services/api"
import { RssFeed } from "~/models/rssFeed"
import { RssFeedsResponse } from "~/models/rssFeedsResponse"
import { useMyRssSources } from "~/rssSources/RssSourcesState"

interface RssFeedsState {
  getRssFeedsLoading: boolean
  goToNextRssFeedLoading: boolean
  likeRssFeedLoading: boolean
  previousRssFeeds: RssFeedsResponse[]
  unreadedRssFeeds: RssFeedsResponse[]
  likedFeeds: RssFeedsResponse[]
}

const initialState: RssFeedsState = {
  getRssFeedsLoading: false,
  goToNextRssFeedLoading: false,
  likeRssFeedLoading: false,
  previousRssFeeds: [],
  unreadedRssFeeds: [],
  likedFeeds: [],
}

export const [RssFeedsContext, RssFeedsProvider] = createStore(initialState)

export function useUnreadedRssFeeds() {
  const { update, ...state } = React.useContext(RssFeedsContext)
  const { decrementRssSource } = useMyRssSources()

  const getUnreadedRssFeeds = (rssSourceUuid?: string) => {
    update({ getRssFeedsLoading: true })
    api.getRssFeeds({ viewed: false }, rssSourceUuid)
      .then(unreadedRssFeeds => update({ unreadedRssFeeds, getRssFeedsLoading: false }))
      .catch(error => {
        // TODO
        update({ getRssFeedsLoading: false })
      })
  }

  const goToPreviuosRssFeed = () => {
    const [first, ...rest] = state.previousRssFeeds
    if (first) {
      const newState = { unreadedRssFeeds: [first, ...state.unreadedRssFeeds], previousRssFeeds: rest }
      update(newState)
    }
  }

  const getNextRssFeed = () => state.unreadedRssFeeds.length > 0 ? state.unreadedRssFeeds[0] : undefined

  const goToNextRssFeed = (rssSourceUuid?: string) => {
    const [first, ...rest] = state.unreadedRssFeeds
    if (first && rest.length === 0) {
      update({ goToNextRssFeedLoading: true })
      api.feedReaction(first.rss_feed, { viewed: true }).then(user_rss_feed => {
        return api.getRssFeeds({ viewed: false }, rssSourceUuid).then(newUnreadedRssFeeds => {
          const newState = {
            unreadedRssFeeds: newUnreadedRssFeeds.filter(r => r.rss_feed.uuid !== first.rss_feed.uuid),
            previousRssFeeds: [{ ...first, user_rss_feed }, ...state.previousRssFeeds.slice(0, 30)],
            goToNextRssFeedLoading: false,
          }
          update(newState)
          decrementRssSource(first.rss_feed)
        })
      ).catch(() => {
        // TODO
        update({ goToNextRssFeedLoading: false })
      })
    } else if (first && !first.user_rss_feed.viewed) {
      update({ goToNextRssFeedLoading: true })
      api.feedReaction(first.rss_feed, { viewed: true }).then(user_rss_feed => {
        const newState = {
          unreadedRssFeeds: rest,
          previousRssFeeds: [{ ...first, user_rss_feed }, ...state.previousRssFeeds.slice(0, 30)],
          goToNextRssFeedLoading: false,
        }
        update(newState)
        decrementRssSource(first.rss_feed)
      }).catch(error => {
        // TODO
        update({ goToNextRssFeedLoading: false })
      })
    } else if (first && (first.user_rss_feed.readed || first.user_rss_feed.liked)) {
      const newState = { unreadedRssFeeds: rest, previousRssFeeds: [first, ...state.previousRssFeeds.slice(0, 30)] }
      update(newState)
    }
  }

  const likeRssFeed = () => {
    const [rssFeed, ...rest] = state.unreadedRssFeeds
    if (rssFeed) {
      update({ likeRssFeedLoading: true })
      api.feedReaction(rssFeed.rss_feed, { liked: true })
        .then(user_rss_feed => {
          const newState = {
            unreadedRssFeeds: [{ ...rssFeed, user_rss_feed }, ...rest],
            likeRssFeedLoading: false,
          }
          update(newState)
        })
        .catch(error => {
          // TODO
          update({ likeRssFeedLoading: false })
        })
    }
  }

  const unlikleRssFeed = () => {
    const [rssFeed, ...rest] = state.unreadedRssFeeds
    if (rssFeed) {
      update({ likeRssFeedLoading: true })
      api.feedReaction(rssFeed.rss_feed, { liked: false })
        .then(user_rss_feed => {
          const newState = {
            unreadedRssFeeds: [{ ...rssFeed, user_rss_feed }, ...rest],
            likeRssFeedLoading: false,
          }
          update(newState)
        })
        .catch(error => {
          // TODO
          update({ likeRssFeedLoading: false })
        })
    }
  }

  return {
    ...state,
    getUnreadedRssFeeds,
    getNextRssFeed,
    goToNextRssFeed,
    goToPreviuosRssFeed,
    likeRssFeed,
    unlikleRssFeed,
  }
}

export function useLikedRssFeeds() {
  const { update, ...state } = React.useContext(RssFeedsContext)

  const getLikedRssFeeds = () => {
    api.getRssFeeds({ liked: true })
      .then(likedFeeds => update({ likedFeeds }))
      .catch(error => { /* TODO */ })
  }

  return {
    getLikedRssFeeds,
    likedFeeds: state.likedFeeds,
  }
}

export function useRssFeed() {
  const { update, ...state } = React.useContext(RssFeedsContext)

  function getRssFeed(rssFeedUuid: string): RssFeedsResponse | undefined {
    // TODO get from api
    return [...state.unreadedRssFeeds, ...state.previousRssFeeds, ...state.likedFeeds].find(rssFeed => rssFeed.rss_feed.uuid === rssFeedUuid)
  }

  const likeRssFeed = (rssFeed: RssFeed) => {
    api.feedReaction(rssFeed, { liked: true })
      .then(user_rss_feed => {
        const likedFeeds = state.likedFeeds.map(r => {
          if (r.rss_feed.uuid === rssFeed.uuid) {
            return { ...r, user_rss_feed }
          } else {
            return r
          }
        })
        update({ likedFeeds })
      })
      .catch(error => { /* TODO */ })
  }

  const unlikeRssFeed = (rssFeed: RssFeed) => {
    api.feedReaction(rssFeed, { liked: false })
      .then(user_rss_feed => {
        const likedFeeds = state.likedFeeds.map(r => {
          if (r.rss_feed.uuid === rssFeed.uuid) {
            return { ...r, user_rss_feed }
          } else {
            return r
          }
        })
        update({ likedFeeds })
      })
      .catch(error => { /* TODO */ })
  }

  return {
    getRssFeed,
    likeRssFeed,
    unlikeRssFeed,
  }
}
