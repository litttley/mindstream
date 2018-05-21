import * as React from "react"
import * as styles from "./SourcesList.css"
import { RssSource, MyRssSources } from "models/RssSource"
import RssSourceComponent from "../components/RssSourceComponent"

interface Props {
    sources: MyRssSources[]
    fallowSource?(source: RssSource): void
}

export default class SourcesList extends React.PureComponent<Props> {
    render() {
        const { sources, fallowSource } = this.props
        return (
            <div className={styles.sourcesList}>
                {sources.map(source => {
                    return (
                        <RssSourceComponent
                            unreaded={source.unreaded}
                            key={source.rss_source.uuid}
                            rssSource={source.rss_source} fallowRssSource={fallowSource}
                        />
                    )
                })}
            </div>
        )
    }
}
