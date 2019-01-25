import * as React from "react"
import { RouteComponentProps } from "react-router"
import RssFeedCard from "~/rssFeeds/components/RssFeedCard"
import Layout from "~/components/Layout"
import Empty from "~/components/Empty"
import { useRssFeed } from "./RssFeedsState"
import { useIntlMessage } from "~/hooks/useIntlMessage"

interface Params {
  rssFeedUuid: string
}

export default function RssFeedScreen({ match: { params: { rssFeedUuid } } }: RouteComponentProps<Params>) {
  const { getRssFeed, likeRssFeed, unlikeRssFeed } = useRssFeed()
  const notFound = useIntlMessage("notFound")
  const rssFeed = getRssFeed(rssFeedUuid)
  return (
    <Layout>
      {
        rssFeed
          ? <RssFeedCard feed={rssFeed} onLike={likeRssFeed} onUnlike={unlikeRssFeed} likedLoading={false} />
          : <Empty message={notFound} />
      }
    </Layout>
  )
}
