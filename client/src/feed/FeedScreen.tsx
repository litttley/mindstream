import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { match as RouterMatch } from "react-router"

import { GlobalState } from "~/Store"
import { Actions } from "~/Actions"
import { RssFeedsResponse } from "~/services/RssFeedsResponse"
import FeedCard from "~/mindstream/components/FeedCard"
import { RssFeed } from "~/models/RssFeed"
import { MindstreamActions } from "~/mindstream/MindstreamActions"
import Layout from "~/components/Layout"
import Loader from "~/components/Loader"
import Empty from "~/components/Empty"
import { InjectedIntlProps, injectIntl } from "react-intl"

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

type Props = StateProps & DispatchProps & Params & InjectedIntlProps

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
      <Layout>
        {this.renderFeedCard()}
      </Layout>
    )
  }

  renderFeedCard = () => {
    const { onLike, likedLoading, getFeedLoading, intl } = this.props
    const feed = this.getFeed()
    if (getFeedLoading) {
      return <Loader />
    } else if (!!feed) {
      return <FeedCard feed={feed} onLike={onLike} likedLoading={likedLoading} />
    } else {
      return <Empty message={intl.formatMessage({ id: "notFound" })} />
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

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(FeedScreen))
