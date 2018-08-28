import * as React from "react"
import * as styles from "./FeedActions.css"
import { RssFeed } from "models/RssFeed"
import FeedAction from "./FeedAction"
import NextIcon from "components/icons/NextIcon"
import PreviousIcon from "components/icons/PreviousIcon"

interface Props {
  feed: RssFeed
  sourceUuid?: string
  loading: boolean
  nextFeedLoader: boolean
  onNextFeed(feed: RssFeed, sourceUuid: string | undefined): void
  onPreviousFeed(sourceUuid: string | undefined): void
}

export default class FeedActions extends React.PureComponent<Props> {
  render() {
    const { feed, loading, nextFeedLoader, sourceUuid, onNextFeed, onPreviousFeed } = this.props
    return (
      <div className={styles.container}>
        <FeedAction
          className={styles.actionPrevious}
          icon={<PreviousIcon />}
          loading={loading}
          onClick={() => onPreviousFeed(sourceUuid)}
        />
        <FeedAction
          className={styles.actionNext}
          icon={<NextIcon />}
          loading={nextFeedLoader}
          onClick={() => onNextFeed(feed, sourceUuid)}
        />
      </div>
    )
  }
}
