import * as React from "react"
import { connect, Dispatch } from "react-redux"
import { GlobalState } from "app/AppState"
import { SourcesActions } from "./SourcesActions"
import AddSourceForm from "./components/AddSourceForm"
import { Actions } from "Actions"

interface DispatchProps {
    addSourceOnChange(field: string, value: string): void
    addSourceOnSubmit(sourceUrl: string): void,
}

interface StateProps {
    newSourceUrl: string
    addSourceLoading: boolean
}

type Props = StateProps & DispatchProps

const AddRssSourceContainer: React.SFC<Props> = ({ newSourceUrl, addSourceOnChange, addSourceOnSubmit }) => (
    <AddSourceForm
        newSourceUrl={newSourceUrl}
        loading={false}
        onChange={addSourceOnChange}
        onSubmit={addSourceOnSubmit}
    />
)

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
    return {
        addSourceOnChange: (field, value) => dispatch(SourcesActions.addSourceOnChange(field, value)),
        addSourceOnSubmit: (sourceUrl) => dispatch(SourcesActions.addSource(sourceUrl)),
    }
}

const mapStateToProps = (state: GlobalState): StateProps => {
    return {
        newSourceUrl: state.sources.newSourceUrl,
        addSourceLoading: state.sources.addSourceLoading,
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AddRssSourceContainer)
