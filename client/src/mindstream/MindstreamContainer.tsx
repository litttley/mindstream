import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { match as RouterMatch } from "react-router"

import { RssFeed, Reaction } from "models/RssFeed"
import { MindstreamActions } from "mindstream/MindstreamActions"
import HeaderContainer from "app/HeaderContainer"
import FeedActions from "mindstream/components/FeedActions"
import { Actions } from "Actions"
import SideMenuContainer from "app/SideMenuContainer"
import MenuContainer from "app/MenuContainer"
import FeedCard from "mindstream/components/FeedCard"
import { RssFeedsResponse } from "services/RssFeedsResponse"
import { GlobalState } from "Store"

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

type Props = StateProps & DispatchProps & Params

class MindstreamContainer extends React.PureComponent<Props> {
  componentWillMount() {
    console.log("MindstreamContainer")
    const { sourceUuid, loadUnreadedFeedsBySource, loadUnreadedFeeds } = this.props
    if (sourceUuid) {
      loadUnreadedFeedsBySource(sourceUuid)
    } else {
      loadUnreadedFeeds()
    }
    document.addEventListener("keydown", this.onKeyPressHandler, false)
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyPressHandler, false)
  }

  render() {
    return (
      <SideMenuContainer renderMenu={() => <MenuContainer />}>
        <HeaderContainer />
        {this.renderStream()}
      </SideMenuContainer>
    )
  }

  renderStream = () => {
    const { feeds, loading, nextFeedLoader, sourceUuid, onNextFeed, onPreviousFeed, onLike, likedLoading } = this.props
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
        </>
      )
    } else if (loading) {
      return <div>Loading</div>
    } else {
      return <div>No more feeds</div>
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

export default connect(mapStateToProps, mapDispatchToProps)(MindstreamContainer)
