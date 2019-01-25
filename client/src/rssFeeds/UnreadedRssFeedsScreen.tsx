import * as React from "react"
import Layout from "~/components/Layout"
import { useUnreadedRssFeeds } from "./RssFeedsState"
import RssFeedCard from "~/rssFeeds/components/RssFeedCard"
import Empty from "~/components/Empty"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import FeedActions from "./components/FeedActions"
import Loader from "~/components/Loader"
import { useKeyDown } from "~/hooks/useKeyDown"

export default function UnreadedRssFeedsScreen() {
  const {
    unreadedRssFeeds,
    previousRssFeeds,
    getRssFeedsLoading,
    goToNextRssFeedLoading,
    getUnreadedRssFeeds,
    getNextRssFeed,
    goToNextRssFeed,
    goToPreviuosRssFeed,
    likeRssFeed,
    likeRssFeedLoading,
    unlikleRssFeed,
  } = useUnreadedRssFeeds()
  const noMoreFeeds = useIntlMessage("noMoreFeeds")

  useKeyDown((event: KeyboardEvent) => {
    if (!goToNextRssFeedLoading && unreadedRssFeeds.length > 0 && (event.code === "ArrowRight" || event.code === "KeyD")) {
      goToNextRssFeed()
    } else if (previousRssFeeds.length > 0 && event.code === "ArrowLeft" || event.code === "KeyQ" || event.code === "KeyA") {
      goToPreviuosRssFeed()
    }
  })

  React.useEffect(() => {
    getUnreadedRssFeeds()
  }, [])

  const nextRssFeed = getNextRssFeed()

  const renderRssFeed = () => {
    if (getRssFeedsLoading) {
      return <Loader />
    } else if (!nextRssFeed) {
      return <Empty message={noMoreFeeds} />
    } else {
      return (
        <>
          <FeedActions
            nextLoading={goToNextRssFeedLoading}
            onNext={() => goToNextRssFeed()}
            onPrevious={() => goToPreviuosRssFeed()}
          />
          <RssFeedCard feed={nextRssFeed} onLike={() => likeRssFeed()} onUnlike={() => unlikleRssFeed()} likedLoading={likeRssFeedLoading} />
        </>
      )
    }
  }

  return (
    <Layout>
      {renderRssFeed()}
    </Layout>
  )
}
