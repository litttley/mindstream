import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"

import { RssSource } from "~/models/RssSource"
import { Actions } from "~/Actions"
import { GlobalState } from "~/Store"
import { SourcesActions } from "~/rssSources/SourcesActions"

import RssSourcesList from "~/rssSources/components/RssSourcesList"

interface DispatchProps {
  fallowSource: (source: RssSource) => void
}

interface StateProps {
  searchRssSourceLoading: boolean
  rssSources: RssSource[]
}

type Props = StateProps & DispatchProps

const RssSourcesContainer = ({ rssSources, fallowSource, searchRssSourceLoading }: Props) => (
  <RssSourcesList loading={searchRssSourceLoading} rssSources={rssSources} fallowSource={fallowSource} />
)

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  fallowSource: (source) => dispatch(SourcesActions.fallowSources.request(source)),
})

const mapStateToProps = ({ sources: { rssSources, searchRssSourceLoading } }: GlobalState): StateProps => ({
  rssSources,
  searchRssSourceLoading
})

export default connect(mapStateToProps, mapDispatchToProps)(RssSourcesContainer)
