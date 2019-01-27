import * as React from "react"
import { MyRssSource, RssSource } from "~/models/RssSource"
import { createStore } from "~/store"
import { api } from "~/services/Api"
import debounce from "lodash.debounce"

export interface RssSourcesState {
  loading: boolean
  searchRssSourceLoading: boolean
  followRssSourceLoading: boolean
  myRssSources: MyRssSource[]
  findedRssSources: RssSource[]
}

const initialState: RssSourcesState = {
  loading: false,
  searchRssSourceLoading: false,
  followRssSourceLoading: false,
  myRssSources: [],
  findedRssSources: [],
}

export const [RssSourcesContext, RssSourcesProvider] = createStore(initialState, "Rss Sources")

export function useMyRssSources() {
  const { update, ...state } = React.useContext(RssSourcesContext)

  const loadMySources = () => {
    update({ loading: true })
    api.loadMyRssSources()
      .then(myRssSources => update({ myRssSources, loading: false }))
      .catch(error => update({ loading: false }))
  }

  const isFollowed = (rssSource: RssSource) => {
    return state.myRssSources.find(s => s.rss_source.uuid === rssSource.uuid) !== undefined
  }

  return {
    isFollowed,
    loadMySources,
    loading: state.loading,
    myRssSources: state.myRssSources,
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
      api.searchRssSource(query)
        .then(findedRssSources => update({ findedRssSources, searchRssSourceLoading: false }))
        .catch(error => update({ searchRssSourceLoading: false }))
    }
  }, 600)

  const followSources = (rssSource: RssSource) => {
    update({ followRssSourceLoading: true })
    api.followRssSource(rssSource)
      .then(myRssSource => {
        update({ followRssSourceLoading: false, myRssSources: [...state.myRssSources, myRssSource] })
      })
      .catch(error => {
        /* TODO */
        update({ followRssSourceLoading: false })
      })
  }

  return {
    clear,
    followSources,
    searchRssSources,
    searchRssSourceLoading: state.searchRssSourceLoading,
    findedRssSources: state.findedRssSources,
  }
}
