import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { match as RouterMatch } from "react-router"

import { GlobalState } from "app/AppState"
import { RssFeed, Reaction } from "models/RssFeed"
import { MindStreamActions } from "mindstream/MindStreamActions"
import MindStreamCard from "mindstream/components/MindStreamCard"
import HeaderContainer from "app/HeaderContainer"
import FeedActions from "mindstream/components/FeedActions"
import { Actions } from "Actions"
import SideMenuContainer from "app/SideMenuContainer"
import MenuContainer from "app/MenuContainer"

interface DispatchProps {
  onReaction(feed: RssFeed, reaction: Reaction, sourceUuid?: string): () => void
  loadUnreadedFeeds(): void
  loadUnreadedFeedsBySource(sourceUuid: string): void
  onNextFeed(feed: RssFeed, sourceUuid: string | undefined): void
  onPreviousFeed(sourceUuid: string | undefined): void
}

interface StateProps {
  feeds: RssFeed[]
  loading: boolean
  nextFeedLoader: boolean
}

interface Params {
  sourceUuid?: string
}

type Props = StateProps & DispatchProps & Params

class MindStreamContainer extends React.PureComponent<Props> {
  componentWillMount() {
    console.log("MindStreamContainer")
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
    const { feeds, loading, nextFeedLoader, sourceUuid, onNextFeed, onPreviousFeed } = this.props
    if (feeds.length > 0) {
      const feed = feeds[0]
      return (
        <>
          <FeedActions
            feed={feed}
            loading={loading}
            nextFeedLoader={nextFeedLoader}
            sourceUuid={sourceUuid}
            onNextFeed={onNextFeed}
            onPreviousFeed={onPreviousFeed}
          />
          <MindStreamCard feed={feed} />
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
      onNextFeed(feeds[0], sourceUuid)
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
    nextFeedLoader: state.mindStream.nextFeedLoader
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    loadUnreadedFeeds: () => dispatch(MindStreamActions.loadUnreadedFeeds.request()),
    loadUnreadedFeedsBySource: (sourceUuid: string) => dispatch(MindStreamActions.loadUnreadedFeedsBySource.request(sourceUuid)),
    onReaction: (feed, reaction, sourceUuid?: string) => () => dispatch(MindStreamActions.readFeed({feed, reaction, sourceUuid})),
    onNextFeed: (feed, sourceUuid: string | undefined) => dispatch(MindStreamActions.nextFeed.request({feed, sourceUuid})),
    onPreviousFeed: (sourceUuid: string | undefined) => dispatch(MindStreamActions.previousFeed(sourceUuid)),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MindStreamContainer)
