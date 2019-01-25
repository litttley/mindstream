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

export const [RssSourcesContext, RssSourcesProvider] = createStore(initialState)

export function useMyRssSources() {
  const { update, ...state } = React.useContext(RssSourcesContext)

  const loadMySources = () => {
    update({ ...state, loading: false })
    api.loadMyRssSources()
      .then(myRssSources => update({ ...state, myRssSources, loading: false }))
      .catch(error => update({ ...state, loading: false }))
  }

  return {
    loadMySources,
    loading: state.loading,
    myRssSources: state.myRssSources,
  }
}

export function useSearchRssSources() {
  const { update, ...state } = React.useContext(RssSourcesContext)

  const searchRssSources = debounce((query: string) => {
    if (query === "") {
      update({ ...state, findedRssSources: [] })
    } else {
      update({ ...state, searchRssSourceLoading: false })
      api.searchRssSource(query)
        .then(findedRssSources => update({ ...state, findedRssSources, searchRssSourceLoading: false }))
        .catch(error => update({ ...state, searchRssSourceLoading: false }))
    }
  }, 600)

  const followSources = (rssSource: RssSource) => {
    update({ ...state, followRssSourceLoading: true })
    api.followSource(rssSource)
      .then(myRssSource => {
        update({ ...state, followRssSourceLoading: false, myRssSources: [...state.myRssSources, myRssSource] })
      })
      .catch(error => {
        /* TODO */
        update({ ...state, followRssSourceLoading: false })
      })
  }

  return {
    followSources,
    searchRssSources,
    searchRssSourceLoading: state.searchRssSourceLoading,
    findedRssSources: state.findedRssSources,
  }
}
