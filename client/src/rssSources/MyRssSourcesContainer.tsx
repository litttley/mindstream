import * as React from "react"
import { connect, Dispatch } from "react-redux"
import * as styles from "./MyRssSourcesContainer.css"

import { GlobalState } from "app/AppState"
import { SourcesActions } from "./SourcesActions"
import { MyRssSources } from "models/RssSource"
import SourcesList from "./components/SourcesList"
import { Actions } from "Actions"

interface DispatchProps {
    onLoadMySources(): void
}

interface StateProps {
    myRssSources: MyRssSources[]
}

type Props = StateProps & DispatchProps

class MyRssSourcesContainer extends React.PureComponent<Props> {
    componentWillMount() {
        this.props.onLoadMySources()
    }
    render() {
        return (
            <div className={styles.myRssSources}>
                {this.renderMyRssSourcesList()}
            </div>
        )
    }

    renderSourcesList = () => {
        const { myRssSources } = this.props
        if (myRssSources.length > 0) {
            return (
                <SourcesList sources={myRssSources} />
            )
        } else {
            return <div>Empty</div>
        }
    }

    renderMyRssSourcesList = () => {
        const { myRssSources } = this.props
        if (myRssSources.length > 0) {
            return (
                <SourcesList
                    sources={myRssSources}
                />
            )
        } else {
            return <div>My Sources Empty</div>
        }
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
    return {
        onLoadMySources: () => dispatch(SourcesActions.loadMySources()),
    }
}

const mapStateToProps = (state: GlobalState): StateProps => {
    return {
        myRssSources: state.sources.myRssSources
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRssSourcesContainer)
