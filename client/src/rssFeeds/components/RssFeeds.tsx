import * as React from "react"
import * as styles from "./RssFeeds.css"
import { RssFeedsResponse } from "~/models/RssFeedsResponse"
import RssFeedExcerpt from "./RssFeedExcerpt"

interface Props {
  rssFeeds: RssFeedsResponse[]
  onRssFeedClick: (feed: RssFeedsResponse) => void
}

export default function RssFeeds({ rssFeeds, onRssFeedClick }: Props) {
  return (
    <div className={styles.feeds}>
      {rssFeeds.map(rssFeed =>
        <RssFeedExcerpt
          key={rssFeed.rss_feed.uuid}
          className={styles.feedExcerpt}
          rssFeed={rssFeed}
          onClick={onRssFeedClick}
        />
      )}
    </div>
  )
}
