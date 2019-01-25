import * as React from "react"
import Layout from "~/components/Layout"
import { useUnreadedRssFeeds } from "./RssFeedsState"
import RssFeedCard from "~/rssFeeds/components/RssFeedCard"
import Empty from "~/components/Empty"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import FeedActions from "./components/FeedActions"
import { RouteComponentProps } from "react-router"

interface Params {
  rssSourceUuid: string
}

// TODO make one with UnreadedRssFeeds
export default function UnreadedRssFeedsByRssSourceScreen(props: RouteComponentProps<Params>) {
  const { match: { params: { rssSourceUuid } } } = props
  const {
    goToNextRssFeed,
    unreadedRssFeeds,
    getUnreadedRssFeeds,
    goToPreviuosRssFeed,
    likeRssFeed,
    goToNextRssFeedLoading,
    likeRssFeedLoading,
    unlikleRssFeed,
  } = useUnreadedRssFeeds()
  const noMoreFeeds = useIntlMessage("noMoreFeeds")

  React.useEffect(() => {
    getUnreadedRssFeeds(rssSourceUuid)
  }, [rssSourceUuid])

  const nextRssFeed = unreadedRssFeeds.length > 0 ? unreadedRssFeeds[0] : undefined

  return (
    <Layout>
      {nextRssFeed
        ? <>
            <FeedActions
              nextLoading={goToNextRssFeedLoading}
              onNext={() => goToNextRssFeed()}
              onPrevious={() => goToPreviuosRssFeed()}
            />
            <RssFeedCard feed={nextRssFeed} onLike={() => likeRssFeed()} onUnlike={() => unlikleRssFeed()} likedLoading={likeRssFeedLoading} />
          </>
        : <Empty message={noMoreFeeds} />
      }
    </Layout>
  )
}
