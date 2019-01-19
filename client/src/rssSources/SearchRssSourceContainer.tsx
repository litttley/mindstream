import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { SourcesActions } from "./SourcesActions"
import SearchSourceForm from "./components/SearchSourceForm"
import { Actions } from "~/Actions"

interface DispatchProps {
  searchRssSources: (value: string) => void
}

type Props = DispatchProps

const SearchRssSourceContainer = ({ searchRssSources }: Props) => (
  <SearchSourceForm disable={false} onChange={searchRssSources} />
)

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => ({
  searchRssSources: query => dispatch(SourcesActions.searchRssSources.request(query)),
})

export default connect(undefined, mapDispatchToProps)(SearchRssSourceContainer)
