import * as React from "react"
import { connect, Dispatch } from "react-redux"
import * as styles from "./SourcesContainer.css"

import { GlobalState } from "app/AppState"
import { SourcesActions } from "./SourcesActions"
import { SourcesState } from "./SourcesReducer"
import { RssSource } from "models/RssSource"
import SourcesList from "./components/SourcesList"
import AddSourceForm from "./components/AddSourceForm"
import HeaderContainer from "app/HeaderContainer"
import { Actions } from "Actions"

interface DispatchProps {
    onLoadUnfollowedSources(): void
    onLoadMySources(): void
    addSourceOnChange(field: string, value: string): void
    addSourceOnSubmit(sourceUrl: string): void,
    fallowSource(source: RssSource): void
}

type Props = SourcesState & DispatchProps

class SourcesContainer extends React.PureComponent<Props> {
    componentWillMount() {
        this.props.onLoadUnfollowedSources()
        this.props.onLoadMySources()
    }
    render() {
        const { newSourceUrl, addSourceOnChange, addSourceOnSubmit } = this.props
        return (
            <div className={styles.sourcesContainer}>
                <HeaderContainer />
                <AddSourceForm
                    newSourceUrl={newSourceUrl}
                    loading={false}
                    onChange={addSourceOnChange}
                    onSubmit={addSourceOnSubmit}
                />
                <h3>Sources</h3>
                {this.renderSourcesList()}
                <h3>My Sources</h3>
                {this.renderMySourcesList()}
            </div>
        )
    }

    renderSourcesList = () => {
        const { fallowSource, sources } = this.props
        if (sources.length > 0) {
            return (
                <SourcesList
                    sources={sources}
                    fallowSource={fallowSource}
                />
            )
        } else {
            return <div>Empty</div>
        }
    }

    renderMySourcesList = () => {
        const { mySources } = this.props
        if (mySources.length > 0) {
            return (
                <SourcesList
                    sources={mySources}
                />
            )
        } else {
            return <div>My Sources Empty</div>
        }
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
    return {
        onLoadUnfollowedSources: () => dispatch(SourcesActions.loadUnfollowedSources()),
        onLoadMySources: () => dispatch(SourcesActions.loadMySources()),
        addSourceOnChange: (field, value) => dispatch(SourcesActions.addSourceOnChange({ field, value })),
        addSourceOnSubmit: (sourceUrl) => dispatch(SourcesActions.addSource({ sourceUrl })),
        fallowSource: (source) => dispatch(SourcesActions.fallowSources({ source })),
    }
}

const mapStateToProps = (state: GlobalState): SourcesState => state.sources

export default connect(mapStateToProps, mapDispatchToProps)(SourcesContainer)
