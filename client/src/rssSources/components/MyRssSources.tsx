import * as React from "react"
import * as styles from "./MyRssSources.css"
import { MyRssSource } from "~/models/RssSource"

interface Props {
  title: string
  myRssSources: MyRssSource[]
}

function MyRssSource(myRssSource: MyRssSource) {
  return (
    <a
      key={myRssSource.rss_source.uuid}
      href={`#/rss/feeds/${myRssSource.rss_source.uuid}`}
      className={styles.myRssSource}
    >
      <div className={styles.myRssSourceTitle}>{myRssSource.rss_source.title}</div>
      <div className={styles.unreaded}>{myRssSource.unreaded}</div>
    </a>
  )
}

export function MyRssSources({ title, myRssSources }: Props) {
  return (
    <>
      <div className={styles.title}>{title}</div>
      <div className={styles.myRssSources}>
        {myRssSources.map(MyRssSource)}
      </div>
    </>
  )
}
