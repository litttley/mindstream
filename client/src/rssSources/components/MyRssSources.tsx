import * as React from "react"
import * as styles from "./MyRssSources.css"
import { MyRssSource } from "~/models/RssSource"

interface Props {
  myRssSources: MyRssSource[]
}

export default class MyRssSources extends React.PureComponent<Props> {
  render() {
    const { myRssSources } = this.props
    return (
      <>
        <div className={styles.title}>My Rss Sources</div>
        <div className={styles.myRssSources}>
          {myRssSources.map(myRssSource => {
            return (
              <a className={styles.myRssSource} href={`#/stream/${myRssSource.rss_source.uuid}`} key={myRssSource.rss_source.uuid}>
                <div className={styles.myRssSourceTitle}>{myRssSource.rss_source.title}</div>
                <div className={styles.unreaded}>{myRssSource.unreaded}</div>
              </a>
            )
          })}
        </div>
      </>
    )
  }
}
