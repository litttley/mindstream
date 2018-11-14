import * as React from "react"
import * as styles from "~/rssSources/components/RssSourceComponent.css"
import { RssSource } from "~/models/RssSource"
import IconButton from "~/components/buttons/IconButton"
import AddIcon from "~/components/icons/AddIcon"

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
      <IconButton onClick={this.fallowSourceHandler}>
        <AddIcon />
      </IconButton>
    )
  }

  fallowSourceHandler = () => {
    const { rssSource, fallowRssSource } = this.props
    if (fallowRssSource) {
      fallowRssSource(rssSource)
    }
  }
}
