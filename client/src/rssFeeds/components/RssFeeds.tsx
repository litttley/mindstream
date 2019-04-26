import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { RssFeedsResponse } from "~/models/rssFeedsResponse"
import { RssFeedExcerpt } from "./RssFeedExcerpt"

interface Props {
  rssFeeds: RssFeedsResponse[]
  onRssFeedClick: (feed: RssFeedsResponse) => void
}

export function RssFeeds({ rssFeeds, onRssFeedClick }: Props) {
  return (
    <div className={css(styles.feeds)}>
      {rssFeeds.map(rssFeed =>
        <RssFeedExcerpt
          key={rssFeed.rss_feed.uuid}
          style={styles.feedExcerpt}
          rssFeed={rssFeed}
          onClick={onRssFeedClick}
        />
      )}
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  feeds: {
    width: "100%",
    hyphens: "auto",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px 20px 50px 20px",
    "@media screen and (min-width: 980px)": {
      width: 900,
      alignSelf: "center",
      padding: "40px 20px 50px 20px",
      margin: "auto",
    },
  },
  feedExcerpt: {
    marginBottom: 30,
  },
})
