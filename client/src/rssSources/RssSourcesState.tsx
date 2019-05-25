import * as React from "react"
import { MyRssSource, RssSource } from "~/models/rssSource"
import { createStore } from "~/Store"
import { api } from "~/services/api"
import debounce from "lodash.debounce"
import { RssFeed } from "~/models/rssFeed"

export interface RssSourcesState {
  loadMySourcesLoading: boolean
  searchRssSourceLoading: boolean
  followRssSourceLoading: boolean
  myRssSources: MyRssSource[]
  findedRssSources: RssSource[]
  getTopRssSourcesLoading: boolean
  topRssSources: RssSource[]
}

const initialState: RssSourcesState = {
  loadMySourcesLoading: false,
  searchRssSourceLoading: false,
  followRssSourceLoading: false,
  myRssSources: [],
  findedRssSources: [],
  getTopRssSourcesLoading: false,
  topRssSources: []
}

export const [RssSourcesContext, RssSourcesProvider] = createStore(initialState, "Rss Sources")

export function useTopRssSources() {
  const { update, ...state } = React.useContext(RssSourcesContext)

  const getUnfollowedRssSources = () => {
    update({ getTopRssSourcesLoading: true })
    api
      .getUnfollowedRssSources()
      .then(topRssSources => update({ topRssSources, getTopRssSourcesLoading: false }))
      .catch(error => update({ getTopRssSourcesLoading: false }))
  }

  const isNoMyRssSources = () => !state.loadMySourcesLoading && state.myRssSources.length === 0

  return {
    topRssSources: state.topRssSources,
    getTopRssSourcesLoading: state.getTopRssSourcesLoading,
    isNoMyRssSources,
    getUnfollowedRssSources
  }
}

export function useMyRssSources() {
  const { update, ...state } = React.useContext(RssSourcesContext)

  const loadMySources = () => {
    update({ loadMySourcesLoading: true })
    api
      .loadMyRssSources()
      .then(myRssSources => update({ myRssSources, loadMySourcesLoading: false }))
      .catch(error => update({ loadMySourcesLoading: false }))
  }

  const isFollowed = (rssSource: RssSource) =>
    state.myRssSources.find(s => s.rss_source.uuid === rssSource.uuid) !== undefined

  const decrementRssSource = (rssFeed: RssFeed) => {
    update({
      myRssSources: state.myRssSources.map(myRssSource => {
        if (myRssSource.rss_source.uuid === rssFeed.rss_source_uuid) {
          return { ...myRssSource, unreaded: myRssSource.unreaded - 1 }
        } else {
          return myRssSource
        }
      })
    })
  }

  return {
    isFollowed,
    loadMySources,
    decrementRssSource,
    loadMySourcesLoading: state.loadMySourcesLoading,
    myRssSources: state.myRssSources
  }
}

export function useSearchRssSources() {
  const { update, ...state } = React.useContext(RssSourcesContext)

  const clear = () => update({ findedRssSources: [] })

  const searchRssSources = debounce((query: string) => {
    if (query === "") {
      update({ findedRssSources: [] })
    } else {
      update({ searchRssSourceLoading: true })
      api
        .searchRssSource(query)
        .then(findedRssSources => update({ findedRssSources, searchRssSourceLoading: false }))
        .catch(error => update({ searchRssSourceLoading: false }))
    }
  }, 600)

  const followRssSources = (rssSource: RssSource) => {
    update({ followRssSourceLoading: true })
    api
      .followRssSource(rssSource)
      .then(myRssSource => {
        update({ followRssSourceLoading: false, myRssSources: [...state.myRssSources, myRssSource] })
      })
      .catch(error => {
        /* TODO */
        update({ followRssSourceLoading: false })
      })
  }

  const unfollowRssSource = (rssSource: RssSource) => {
    update({ followRssSourceLoading: true })
    api
      .unfollowRssSource(rssSource)
      .then(myRssSource => {
        update({
          followRssSourceLoading: false,
          myRssSources: state.myRssSources.filter(s => s.rss_source.uuid !== rssSource.uuid)
        })
      })
      .catch(error => {
        /* TODO */
        update({ followRssSourceLoading: false })
      })
  }

  return {
    clear,
    followRssSources,
    unfollowRssSource,
    searchRssSources,
    searchRssSourceLoading: state.searchRssSourceLoading,
    findedRssSources: state.findedRssSources
  }
}
