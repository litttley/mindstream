import * as React from "react"
import { Layout } from "~/components/Layout"
import { SearchSourceForm } from "./components/SearchSourceForm"
import { useSearchRssSources, useTopRssSources } from "./RssSourcesState"
import { RssSourcesList } from "./components/RssSourcesList"

export function RssSourcesScreen() {
  const {
    clear,
    findedRssSources,
    searchRssSourceLoading,
    searchRssSources,
    followRssSources,
    unfollowRssSource
  } = useSearchRssSources()
  const { topRssSources, isNoMyRssSources, getUnfollowedRssSources, getTopRssSourcesLoading } = useTopRssSources()

  React.useEffect(() => {
    clear()
    if (isNoMyRssSources()) {
      getUnfollowedRssSources()
    }
  }, [])

  const showTopRssSources = !isNoMyRssSources() && findedRssSources.length !== 0

  const rssSources = showTopRssSources ? findedRssSources : topRssSources
  const loading = getTopRssSourcesLoading || searchRssSourceLoading

  return (
    <Layout>
      <SearchSourceForm onChange={searchRssSources} />
      <RssSourcesList
        loading={loading}
        rssSources={rssSources}
        followRssSource={followRssSources}
        unfollowRssSource={unfollowRssSource}
      />
    </Layout>
  )
}
