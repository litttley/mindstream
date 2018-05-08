import * as React from "react"
import * as styles from "./SourcesList.css"
import { RssSource } from "models/RssSource"
import SourcesCard from "../components/SourceCard"

interface Props {
    sources: RssSource[]
    fallowSource?(source: RssSource): void
}

export default class SourcesList extends React.PureComponent<Props> {
    render() {
        const { sources, fallowSource } = this.props
        return (
            <div className={styles.sourcesList}>
                {sources.map(source => {
                    return <SourcesCard count={0} key={source.uuid} source={source} fallowSource={fallowSource}/>
                })}
            </div>
        )
    }
}
