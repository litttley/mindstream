import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"

import { RssFeed } from "models/RssFeed"
import { GlobalState } from "app/AppState"
import { FeedsActions } from "feeds/FeedsActions"
import FeedsList from "feeds/components/FeedsList"
import HeaderContainer from "app/HeaderContainer"
import { Actions } from "Actions"
import SideMenuContainer from "app/SideMenuContainer"
import MenuContainer from "app/MenuContainer"

interface PropsState {
  feeds: RssFeed[]
}

interface DispatchProps {
  onLoad: () => void
}

type Props = PropsState & DispatchProps

class FeedsContainer extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.onLoad()
  }
  render() {
    return (
      <SideMenuContainer renderMenu={() => <MenuContainer />}>
        <HeaderContainer />
        <FeedsList feeds={this.props.feeds} />
      </SideMenuContainer>
    )
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
