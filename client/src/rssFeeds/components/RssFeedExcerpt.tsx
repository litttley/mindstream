import * as React from "react"
import classNames from "classnames"
import * as styles from "./RssFeedExcerpt.css"
import { RssFeedsResponse } from "~/models/RssFeedsResponse"
import { getTitle, getExcerpt } from "~/models/RssFeed"

interface Props {
  rssFeed: RssFeedsResponse
  onClick: (feed: RssFeedsResponse) => void
  className?: string
}

export function RssFeedExcerpt({ rssFeed, className, onClick }: Props) {
    const { rss_feed } = rssFeed
    const { readable } = rss_feed
    return (
      <div role="button" onClick={() => onClick(rssFeed)} className={classNames(styles.feedExcerpt, className)}>
        <div className={styles.imageContainer}>
          {readable ? <img className={styles.image} src={readable.lead_image_url} /> : <div className={styles.noImage} />}
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {getTitle(rss_feed)}
          </h1>
          <p className={styles.excerpt}>
            {getExcerpt(rss_feed)}
          </p>
        </div>
      </div>
    )
}
