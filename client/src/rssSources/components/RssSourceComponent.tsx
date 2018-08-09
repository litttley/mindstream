import * as React from "react"
import * as styles from "rssSources/components/RssSourceComponent.css"
import IconButton from "components/IconButton"
import { RssSource } from "models/RssSource"

interface Props {
  rssSource: RssSource
  unreaded?: number
  fallowRssSource?: (rssSource: RssSource) => void
}

export default class RssSourceComponent extends React.PureComponent<Props> {
  render() {
    const { rssSource, fallowRssSource, unreaded = 0 } = this.props
    return (
      <div className={styles.sourceCard}>
        <div className={styles.counter}>{unreaded}</div>
        <a className={styles.title} href={`#/stream/${rssSource.uuid}`}>
          {rssSource.title}
        </a>
        {fallowRssSource ? this.renderFallow() : null }
      </div>
    )
  }

  renderFallow = () => {
    return (
      <IconButton type="Add" onClick={this.fallowSourceHandler} />
    )
  }

  fallowSourceHandler = () => {
    const { rssSource, fallowRssSource } = this.props
    if (fallowRssSource) {
      fallowRssSource(rssSource)
    }
  }
}
