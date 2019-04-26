import * as React from "react"
import { StyleSheet, css, CSSProperties, StyleDeclarationValue } from "aphrodite/no-important"
import { RssFeedsResponse } from "~/models/rssFeedsResponse"
import { getTitle, getExcerpt } from "~/models/rssFeed"
import { colors } from "~/guideStyles"

interface Props {
  rssFeed: RssFeedsResponse
  onClick: (feed: RssFeedsResponse) => void
  style?: StyleDeclarationValue
}

export function RssFeedExcerpt({ rssFeed, style, onClick }: Props) {
    const { rss_feed } = rssFeed
    const { readable } = rss_feed

    return (
      <div role="button" onClick={() => onClick(rssFeed)} className={css(styles.feedExcerpt, style)}>
        <div className={css(styles.imageContainer)}>
          {readable ? <img className={css(styles.image)} src={readable.lead_image_url} /> : <div className={css(styles.noImage)} />}
        </div>
        <div className={css(styles.content)}>
          <h1 className={css(styles.title)}>
            {getTitle(rss_feed)}
          </h1>
          <p className={css(styles.excerpt)}>
            {getExcerpt(rss_feed)}
          </p>
        </div>
      </div>
    )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  feedExcerpt: {
    display: "flex",
    flexDirection: "row",
    padding: 10,
    cursor: "pointer",
    ":hover": {
      backgroundColor: "#EEEEEE",
    },
  },
  content: {
    flex: 1,
  },
  imageContainer: {
    width: 100,
    height: 100,
    marginRight: 10,
    "@media screen and (min-width: 480px)": {
      width: 150,
      height: 150,
      marginRight: 10,
    },
  },
  image: {
    width: "100%",
  },
  noImage: {
    width: "100%",
    height: "100%",
    backgroundColor: "#AAAAAA",
  },
  title: {
    fontSize: "1.3rem",
    color: colors.primary,
    marginBottom: 10,

    "@media screen and (min-width: 480px)": {
      fontSize: "1.5rem",
    },
  },
  excerpt: {
    fontSize: "1rem",
    color: "#666666",
  },
})
