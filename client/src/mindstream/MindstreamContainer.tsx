import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { match as RouterMatch } from "react-router"
import { InjectedIntlProps, injectIntl } from "react-intl"

import { RssFeed, Reaction } from "~/models/RssFeed"
import { MindstreamActions } from "~/mindstream/MindstreamActions"
import FeedActions from "~/mindstream/components/FeedActions"
import { Actions } from "~/Actions"
import FeedCard from "~/mindstream/components/FeedCard"
import { RssFeedsResponse } from "~/services/RssFeedsResponse"
import { GlobalState } from "~/Store"
import Layout from "~/components/Layout"
import Empty from "~/components/Empty"
import Loader from "~/components/Loader"
import KeyDownAction from "~/components/KeyDownAction"

interface DispatchProps {
  onReaction(feed: RssFeed, reaction: Reaction, sourceUuid?: string): () => void
  loadUnreadedFeeds(): void
  loadUnreadedFeedsBySource(sourceUuid: string): void
  onNextFeed(feed: RssFeed, sourceUuid: string | undefined): void
  onLike: (feed: RssFeed) => void
  onPreviousFeed(sourceUuid: string | undefined): void
}

interface StateProps {
  feeds: RssFeedsResponse[]
  loading: boolean
  nextFeedLoader: boolean
  likedLoading: boolean
}

interface Params {
  sourceUuid?: string
}

type Props = StateProps & DispatchProps & Params & InjectedIntlProps

class MindstreamContainer extends React.PureComponent<Props> {
  componentWillMount() {
    const { sourceUuid, loadUnreadedFeedsBySource, loadUnreadedFeeds } = this.props
    if (sourceUuid) {
      loadUnreadedFeedsBySource(sourceUuid)
    } else {
      loadUnreadedFeeds()
    }
  }

  render() {
    return (
      <Layout>
        {this.renderStream()}
      </Layout>
    )
  }

  renderStream = () => {
    const { feeds, loading, nextFeedLoader, sourceUuid, onNextFeed, onPreviousFeed, onLike, likedLoading, intl } = this.props
    if (!loading && feeds.length > 0) {
      const feed = feeds[0]
      return (
        <>
          <FeedActions
            feed={feed.rss_feed}
            loading={loading}
            nextFeedLoader={nextFeedLoader}
            sourceUuid={sourceUuid}
            onNextFeed={onNextFeed}
            onPreviousFeed={onPreviousFeed}
          />
          <FeedCard feed={feed} onLike={onLike} likedLoading={likedLoading} />
          <KeyDownAction onKeyDown={this.onKeyPressHandler} />
        </>
      )
    } else if (loading) {
      return <Loader />
    } else {
      return <Empty message={intl.formatMessage({ id: "noMoreFeeds" })} />
    }
  }

  onKeyPressHandler = (event: KeyboardEvent) => {
    const { feeds, onNextFeed, onPreviousFeed, sourceUuid, nextFeedLoader } = this.props
    if (!nextFeedLoader && feeds.length > 0 && event.code === "ArrowRight" || event.code === "KeyD") {
      onNextFeed(feeds[0].rss_feed, sourceUuid)
    } else if (feeds.length > 0 && event.code === "ArrowLeft" || event.code === "KeyQ" || event.code === "KeyA") {
      onPreviousFeed(sourceUuid)
    }
  }
}

const mapStateToProps = (state: GlobalState, props?: { match?: RouterMatch<Params> }): StateProps & Params => {
  const sourceUuid = props && props.match && props.match.params && props.match.params.sourceUuid
  return {
    sourceUuid,
    feeds: state.mindStream.feeds,
    loading: state.mindStream.loading,
    nextFeedLoader: state.mindStream.nextFeedLoader,
    likedLoading: state.mindStream.likedLoading,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    loadUnreadedFeeds: () => dispatch(MindstreamActions.loadUnreadedFeeds.request()),
    loadUnreadedFeedsBySource: (sourceUuid: string) => dispatch(MindstreamActions.loadUnreadedFeedsBySource.request(sourceUuid)),
    onReaction: (feed, reaction, sourceUuid?: string) => () => dispatch(MindstreamActions.readFeed({feed, reaction, sourceUuid})),
    onNextFeed: (feed, sourceUuid: string | undefined) => dispatch(MindstreamActions.nextFeed.request({feed, sourceUuid})),
    onPreviousFeed: (sourceUuid: string | undefined) => dispatch(MindstreamActions.previousFeed(sourceUuid)),
    onLike: feed => dispatch(MindstreamActions.like.request(feed)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(MindstreamContainer))
