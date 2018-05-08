import * as React from "react"
import { connect, Dispatch } from "react-redux"

import { RssFeed } from "models/RssFeed"
import { GlobalState } from "../app/AppState"
import { FeedsActions } from "./FeedsActions"
import FeedsList from "./components/FeedsList"
import HeaderContainer from "../app/HeaderContainer"

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

const mapDispatchToProps = (dispatch: Dispatch<GlobalState>): DispatchProps => {
    return {
        onLoad: () => dispatch(FeedsActions.loadfeeds())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FeedsContainer)
