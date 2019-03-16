import * as React from "react"
import { Layout } from "~/components/Layout"
import { SearchSourceForm } from "./components/SearchSourceForm"
import { useSearchRssSources } from "./RssSourcesState"
import { RssSourcesList } from "./components/RssSourcesList"

export function RssSourcesScreen() {
  const { clear, findedRssSources, searchRssSourceLoading, searchRssSources, followSources } = useSearchRssSources()

  React.useEffect(() => {
    clear()
  }, [])

  return (
    <Layout>
      <SearchSourceForm onChange={searchRssSources} />
      <RssSourcesList loading={searchRssSourceLoading} rssSources={findedRssSources} followSource={followSources} />
    </Layout>
  )
}
