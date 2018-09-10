import * as React from "react"
import { connect } from "react-redux"
import { Dispatch } from "redux"
import * as styles from "./MyRssSourcesContainer.css"

import { SourcesActions } from "./SourcesActions"
import { MyRssSources } from "models/RssSource"
import SourcesList from "./components/SourcesList"
import { Actions } from "Actions"
import { GlobalState } from "Store"

interface DispatchProps {
  onLoadMySources: () => void
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
    onLoadMySources: () => dispatch(SourcesActions.loadMySources.request()),
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  const { myRssSources } = state.sources
  return { myRssSources }
}

export default connect(mapStateToProps, mapDispatchToProps)(MyRssSourcesContainer)
