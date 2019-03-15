import * as React from "react"
import { Layout } from "~/components/Layout"
import { useUnreadedRssFeeds } from "./RssFeedsState"
import { RssFeedCard } from "~/rssFeeds/components/RssFeedCard"
import { Empty } from "~/components/Empty"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { FeedActions } from "./components/FeedActions"
import { RouteComponentProps } from "react-router"
import { useKeyDown } from "~/hooks/useKeyDown"
import { Loader } from "~/components/Loader"
import { NextRssSource } from "./components/NextRssSource"

interface Params {
  rssSourceUuid: string
}

// TODO make one with UnreadedRssFeeds
export function UnreadedRssFeedsByRssSourceScreen(props: RouteComponentProps<Params>) {
  const { match: { params: { rssSourceUuid } } } = props
  const {
    goToNextRssFeed,
    unreadedRssFeeds,
    previousRssFeeds,
    getUnreadedRssFeeds,
    goToPreviuosRssFeed,
    likeRssFeed,
    goToNextRssFeedLoading,
    likeRssFeedLoading,
    unlikleRssFeed,
    getRssFeedsLoading,
  } = useUnreadedRssFeeds()
  const message = useIntlMessage()

  React.useEffect(() => {
    getUnreadedRssFeeds(rssSourceUuid)
  }, [rssSourceUuid])

  useKeyDown((event: KeyboardEvent) => {
    if (!goToNextRssFeedLoading && unreadedRssFeeds.length > 0 && (event.code === "ArrowRight" || event.code === "KeyD")) {
      goToNextRssFeed(rssSourceUuid)
    } else if (previousRssFeeds.length > 0 && event.code === "ArrowLeft" || event.code === "KeyQ" || event.code === "KeyA") {
      goToPreviuosRssFeed()
    }
  })

  const nextRssFeed = unreadedRssFeeds.length > 0 ? unreadedRssFeeds[0] : undefined

  const renderRssFeed = () => {
    if (getRssFeedsLoading) {
      return <Loader />
    } else if (!nextRssFeed) {
      return (
        <>
          <Empty message={message("noMoreFeeds")} />
          <NextRssSource rssSourceUuid={rssSourceUuid} />
        </>
      )
    } else {
      return (
        <>
          <FeedActions
            nextLoading={goToNextRssFeedLoading}
            onNext={() => goToNextRssFeed(rssSourceUuid)}
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
