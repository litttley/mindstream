import * as React from "react"
import * as styles from "./Feeds.css"
import FeedExcerpt from "feeds/components/FeedExcerpt"
import { RssFeedsResponse } from "services/RssFeedsResponse"

interface Props {
  feeds: RssFeedsResponse[]
  onFeedClick: (feed: RssFeedsResponse) => void
}

export default class Feeds extends React.PureComponent<Props> {
  render() {
    const { feeds, onFeedClick } = this.props
    return (
      <div className={styles.feeds}>
        {feeds.map(feed =>
          <FeedExcerpt
            className={styles.feedExcerpt}
            key={feed.rss_feed.uuid}
            feed={feed}
            onClick={onFeedClick}
          />
        )}
      </div>
    )
  }
}
