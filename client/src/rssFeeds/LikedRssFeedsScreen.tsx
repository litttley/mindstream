import * as React from "react"
import { RssFeedsResponse } from "~/models/RssFeedsResponse"
import { Layout } from "~/components/Layout"
import { RssFeeds } from "./components/RssFeeds"
import * as router from "~/router"
import { useLikedRssFeeds } from "./RssFeedsState"

export function LikedRssFeedsScreen() {
  const { likedFeeds, getLikedRssFeeds } = useLikedRssFeeds()

  React.useEffect(() => {
    getLikedRssFeeds()
  }, [])

  return (
    <Layout>
      <RssFeeds rssFeeds={likedFeeds} onRssFeedClick={handleOnRssFeedClick} />
    </Layout>
  )
}

function handleOnRssFeedClick(feed: RssFeedsResponse) {
  router.push(`/rss/feed/${feed.rss_feed.uuid}`)
}
