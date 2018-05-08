import * as React from "react"
import * as styles from "./FeedActions.css"
import { RssFeed, Reaction } from "models/RssFeed"
import FeedAction from "./FeedAction"

interface Props {
    feed: RssFeed
    sourceUuid?: string
    loading: boolean
    nextFeedLoader: boolean
    onNextFeed(feed: RssFeed, sourceUuid: string | undefined): void
    onPreviousFeed(sourceUuid: string | undefined): void
    onReaction(feed: RssFeed, reaction: Reaction, sourceUuid?: string): () => void
}

export default class FeedActions extends React.PureComponent<Props> {
    render() {
        const { feed, loading, nextFeedLoader, sourceUuid, onReaction, onNextFeed, onPreviousFeed } = this.props
        return (
            <div className={styles.container}>
                <FeedAction className={styles.actionLike} name="Previous" loading={loading} onClick={() => onPreviousFeed(sourceUuid)} />
                <FeedAction className={styles.actionRead} name="Liked" loading={loading} onClick={onReaction(feed, "Liked", sourceUuid)} />
                <FeedAction className={styles.actionNext} name="Next" loading={nextFeedLoader} onClick={() => onNextFeed(feed, sourceUuid)} />
            </div>
        )
    }
}
