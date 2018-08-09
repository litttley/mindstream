import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import * as styles from "rssSources/UnfollowedRssSourcesContainer.css"
import { Actions } from "Actions"
import { GlobalState } from "app/AppState"
import { RssSource } from "models/RssSource"
import { SourcesActions } from "rssSources/SourcesActions"
import SourcesList from "rssSources/components/SourcesList"

interface DispatchProps {
  onLoadUnfollowedSources: () => void
  fallowSource: (source: RssSource) => void
}

interface StateProps {
  unfollowedRssSources: RssSource[]
}

type Props = StateProps & DispatchProps

class UnfollowedRssSourcesContainer extends React.PureComponent<Props> {
  componentWillMount() {
    this.props.onLoadUnfollowedSources()
  }
  render() {
    return (
      <div className={styles.unfollowedRssSources}>
        {this.renderUnfollowedRssSourcesList()}
      </div>
    )
  }

  renderUnfollowedRssSourcesList = () => {
    const { fallowSource, unfollowedRssSources } = this.props
    if (unfollowedRssSources.length > 0) {
      return (
        <SourcesList
          sources={unfollowedRssSources.map(rss_source => ({
            rss_source,
            unreaded: 0
          }))}
          fallowSource={fallowSource}
        />
      )
    } else {
      return <div>Empty</div>
    }
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    onLoadUnfollowedSources: () => dispatch(SourcesActions.loadUnfollowedSources.request()),
    fallowSource: (source) => dispatch(SourcesActions.fallowSources.request(source)),
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    unfollowedRssSources: state.sources.unfollowedRssSources
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(UnfollowedRssSourcesContainer)
