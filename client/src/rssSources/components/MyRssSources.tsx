import * as React from "react"
import * as styles from "./MyRssSources.css"
import { MyRssSource } from "~/models/RssSource"

interface Props {
  title: string
  myRssSources: MyRssSource[]
}

export default function MyRssSources({ title, myRssSources }: Props) {
    return (
      <>
        <div className={styles.title}>{title}</div>
        <div className={styles.myRssSources}>
          {myRssSources.map(myRssSource => {
            return (
              <a className={styles.myRssSource} href={`#/rss/feeds/${myRssSource.rss_source.uuid}`} key={myRssSource.rss_source.uuid}>
                <div className={styles.myRssSourceTitle}>{myRssSource.rss_source.title}</div>
                <div className={styles.unreaded}>{myRssSource.unreaded}</div>
              </a>
            )
          })}
        </div>
      </>
    )
}
