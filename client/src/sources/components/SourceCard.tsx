import * as React from "react"
import * as styles from "./SourceCard.css"
import IconButton from "../../components/IconButton"
import { RssSource } from "models/RssSource"

interface Props {
    source: RssSource
    count?: number
    fallowSource?(source: RssSource): void
}

export default class SourcesCard extends React.PureComponent<Props> {
    render() {
        const { source, fallowSource, count = 0 } = this.props
        return (
            <div className={styles.sourceCard}>
                <div className={styles.counter}>{count}</div>
                <a className={styles.title} href={`#/stream/${source.uuid}`}>
                    {source.title}
                </a>
                {fallowSource ? this.renderFallow() : null }
            </div>
        )
    }

    renderFallow = () => {
        return (
            <IconButton type="Add" onClick={this.fallowSourceHandler} />
        )
    }

    fallowSourceHandler = () => {
        const { source, fallowSource } = this.props
        if (fallowSource) {
            fallowSource(source)
        }
    }
}
