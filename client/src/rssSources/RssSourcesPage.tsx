import * as React from "react"
import RssSourcesContainer from "~/rssSources/RssSourcesContainer"
import SearchRssSourceContainer from "~/rssSources/SearchRssSourceContainer"
import Layout from "~/components/Layout"

const RssSourcesPage = () => (
  <Layout>
    <SearchRssSourceContainer />
    <RssSourcesContainer />
  </Layout>
)

export default RssSourcesPage
