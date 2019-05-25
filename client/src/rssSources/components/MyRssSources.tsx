import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { MyRssSource } from "~/models/rssSource"
import { colors } from "~/guideStyles"

interface Props {
  title: string
  myRssSources: MyRssSource[]
}

function MyRssSource(myRssSource: MyRssSource) {
  return (
    <a
      className={css(styles.myRssSource)}
      href={`#/rss/feeds/${myRssSource.rss_source.uuid}`}
      key={myRssSource.rss_source.uuid}
    >
      <div className={css(styles.myRssSourceTitle)}>{myRssSource.rss_source.title}</div>
      <div className={css(styles.unreaded)}>{myRssSource.unreaded}</div>
    </a>
  )
}

export function MyRssSources({ title, myRssSources }: Props) {
  return (
    <>
      <div className={css(styles.title)}>{title}</div>
      <div className={css(styles.myRssSources)}>{myRssSources.map(MyRssSource)}</div>
    </>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  myRssSources: {
    overflowY: "auto"
  },
  title: {
    color: colors.secondary,
    fontSize: "1rem",
    margin: "30px 20px 5px 20px"
  },
  myRssSource: {
    padding: "10px 20px",
    display: "flex",
    flexDirection: "row",
    textDecoration: "none",
    justifyContent: "space-between",
    ":hover": {
      backgroundColor: colors.secondaryClear
    }
  },
  unreaded: {
    textDecoration: "none",
    fontSize: "0.8rem",
    color: colors.primary
  },
  myRssSourceTitle: {
    fontSize: "0.8rem",
    color: colors.primary
  }
})
