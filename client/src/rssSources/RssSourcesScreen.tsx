import * as React from "react"
import Layout from "~/components/Layout"
import SearchSourceForm from "./components/SearchSourceForm"
import { useSearchRssSources } from "./RssSourcesState"
import RssSourcesList from "./components/RssSourcesList"

export default function RssSourcesScreen() {
  const { findedRssSources, searchRssSourceLoading, searchRssSources, followSources } = useSearchRssSources()
  return (
    <Layout>
      <SearchSourceForm onChange={searchRssSources} />
      <RssSourcesList loading={searchRssSourceLoading} rssSources={findedRssSources} followSource={followSources} />
    </Layout>
  )
}
