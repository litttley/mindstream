import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { match as RouterMatch } from "react-router"

import SideMenuContainer from "~/app/SideMenuContainer"
import MenuContainer from "~/app/MenuContainer"
import HeaderContainer from "~/app/HeaderContainer"
import { GlobalState } from "~/Store"
import { Actions } from "~/Actions"
import { RssFeedsResponse } from "~/services/RssFeedsResponse"
import FeedCard from "~/mindstream/components/FeedCard"
import { RssFeed } from "~/models/RssFeed"
import { MindstreamActions } from "~/mindstream/MindstreamActions"

interface DispatchProps {
  onLike: (feed: RssFeed) => void
  getFeed: (uuid: string) => void
}

interface StateProps {
  feeds: RssFeedsResponse[]
  likedFeeds: RssFeedsResponse[]
  likedLoading: boolean
  getFeedLoading: boolean
}

interface Params {
  uuid: string
}

type Props = StateProps & DispatchProps & Params

class FeedScreen extends React.PureComponent<Props> {

  componentDidMount() {
    const { uuid, getFeed } = this.props
    const feed = this.getFeed()
    if (!feed) {
      getFeed(uuid)
    }
  }

  render() {
    return (
      <SideMenuContainer renderMenu={() => <MenuContainer />}>
        <HeaderContainer />
        {this.renderFeedCard()}
      </SideMenuContainer>
    )
  }

  renderFeedCard = () => {
    const { onLike, likedLoading, getFeedLoading } = this.props
    const feed = this.getFeed()
    if (getFeedLoading) {
      return <div>Loading</div>
    } else if (!!feed) {
      return <FeedCard feed={feed} onLike={onLike} likedLoading={likedLoading} />
    } else {
      return <div>Not Found</div>
    }
  }

  getFeed = () => {
    const { uuid, feeds, likedFeeds } = this.props
    return [...feeds, ...likedFeeds].find(feed => feed.rss_feed.uuid === uuid)
  }
}

const mapStateToProps = (state: GlobalState, props: { match: RouterMatch<Params> }): StateProps & Params => {
  const uuid = props.match.params.uuid
  const { mindStream, feeds } = state
  return {
    uuid,
    likedFeeds: feeds.feeds,
    feeds: mindStream.feeds,
    likedLoading: mindStream.likedLoading,
    getFeedLoading: mindStream.getFeedLoading,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    onLike: feed => dispatch(MindstreamActions.like.request(feed)),
    getFeed: uuid => dispatch(MindstreamActions.getFeed.request(uuid))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedScreen)
