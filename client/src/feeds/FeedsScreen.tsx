import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { ConnectedRouterProps } from "connected-react-router"

import { FeedsActions } from "feeds/FeedsActions"
import Feeds from "feeds/components/Feeds"
import HeaderContainer from "app/HeaderContainer"
import { Actions } from "Actions"
import SideMenuContainer from "app/SideMenuContainer"
import MenuContainer from "app/MenuContainer"
import { GlobalState } from "Store"
import { RssFeedsResponse } from "services/RssFeedsResponse"

interface PropsState {
  feeds: RssFeedsResponse[]
}

interface DispatchProps {
  onLoad: () => void
}

type Props = PropsState & DispatchProps & ConnectedRouterProps

class FeedsContainer extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.onLoad()
  }

  render() {
    console.log(this.props)
    const { feeds } = this.props
    return (
      <SideMenuContainer renderMenu={() => <MenuContainer />}>
        <HeaderContainer />
        <Feeds feeds={feeds} onFeedClick={this.handleOnFeedClick} />
      </SideMenuContainer>
    )
  }

  handleOnFeedClick = (feed: RssFeedsResponse) => {
    this.props.history.push(`/feed/${feed.rss_feed.uuid}`)
  }
}

const mapStateToProps = (state: GlobalState): PropsState => {
  const { feeds } = state.feeds
  return { feeds }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    onLoad: () => dispatch(FeedsActions.loadfeeds.request())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedsContainer)