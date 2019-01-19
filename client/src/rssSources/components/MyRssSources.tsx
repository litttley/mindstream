import * as React from "react"
import * as styles from "./MyRssSources.css"
import { MyRssSource } from "~/models/RssSource"
import { InjectedIntlProps, injectIntl } from "react-intl"

interface Props {
  myRssSources: MyRssSource[]
}

class MyRssSources extends React.PureComponent<Props & InjectedIntlProps> {
  render() {
    const { myRssSources, intl } = this.props
    return (
      <>
        <div className={styles.title}>{intl.formatMessage({ id: "myRssSources" })}</div>
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

export default injectIntl(MyRssSources)
