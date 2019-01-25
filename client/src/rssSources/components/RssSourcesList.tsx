import * as React from "react"
import * as styles from "./RssSourcesList.css"
import { RssSource } from "~/models/RssSource"
import RssSourceCard from "./RssSourceCard"
import Empty from "~/components/Empty"
import Loader from "~/components/Loader"

interface Props {
  loading: boolean
  rssSources: RssSource[]
  followSource: (rssSource: RssSource) => void
}

export default function RssSourcesList({ rssSources, followSource, loading }: Props) {
  const List = rssSources.map(rssSource => (
    <RssSourceCard
      key={rssSource.uuid}
      rssSource={rssSource}
      followRssSource={followSource}
    />
  ))

  const list = rssSources.length > 0 ? List : <Empty message="No rss source found" />

  const content = loading ? <Loader /> : list

  return <div className={styles.rssSourcesList}>{content}</div>
}
