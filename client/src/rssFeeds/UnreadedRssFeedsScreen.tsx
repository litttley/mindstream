import * as React from "react"

import { useUnreadedRssFeeds } from "./RssFeedsState"
import { RssFeedCard } from "~/rssFeeds/components/RssFeedCard"
import { Empty } from "~/components/Empty"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { FeedActions } from "./components/FeedActions"
import { Loader } from "~/components/Loader"
import { useKeyDown } from "~/hooks/useKeyDown"
import { Layout } from "~/components/Layout"

export function UnreadedRssFeedsScreen() {
  const message = useIntlMessage()
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
      return <Empty message={message("noMoreFeeds")} />
    } else {
      return (
        <>
          <FeedActions
            nextLoading={goToNextRssFeedLoading}
            onNext={goToNextRssFeed}
            onPrevious={goToPreviuosRssFeed}
          />
          <RssFeedCard
            feed={nextRssFeed}
            onLike={likeRssFeed}
            onUnlike={unlikleRssFeed}
            likedLoading={likeRssFeedLoading}
          />
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
