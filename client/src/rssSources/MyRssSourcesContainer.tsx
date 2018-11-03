import * as React from "react"
import { connect } from "react-redux"
import * as styles from "./MyRssSourcesContainer.css"

import { MyRssSource } from "~/models/RssSource"
import SourcesList from "./components/SourcesList"
import { GlobalState } from "~/Store"

interface Props {
  myRssSources: MyRssSource[]
}

class MyRssSourcesContainer extends React.PureComponent<Props> {
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

const mapStateToProps = (state: GlobalState): Props => {
  const { myRssSources } = state.sources
  return { myRssSources }
}

export default connect(mapStateToProps)(MyRssSourcesContainer)
