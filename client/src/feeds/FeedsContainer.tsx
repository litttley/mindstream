import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"

import { RssFeed } from "models/RssFeed"
import { GlobalState } from "app/AppState"
import { FeedsActions } from "feeds/FeedsActions"
import FeedsList from "feeds/components/FeedsList"
import HeaderContainer from "app/HeaderContainer"
import { Actions } from "Actions"

interface DispatchProps {
    onLoad(): void
}

interface PropsState {
    feeds: RssFeed[]
}

type Props = PropsState & DispatchProps

class FeedsContainer extends React.PureComponent<Props> {
    componentWillMount() {
        this.props.onLoad()
    }
    render() {
        return (
            <div style={{ flex: 1 }}>
                <HeaderContainer />
                <FeedsList feeds={this.props.feeds} />
            </div>
        )
    }
}

const mapStateToProps = (state: GlobalState): PropsState => {
    return {
        feeds: state.feeds.feeds
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
    return {
        onLoad: () => dispatch(FeedsActions.loadfeeds())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedsContainer)
