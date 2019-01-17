import * as React from "react"
import * as styles from "./RssSourcesList.css"
import { RssSource } from "~/models/RssSource"
import RssSourceCard from "./RssSourceCard"
import LoaderIcon from "~/components/icons/LoaderIcon"

interface Props {
  loading: boolean
  rssSources: RssSource[]
  fallowSource?: (source: RssSource) => void
}

export default function RssSourcesList({ rssSources, fallowSource, loading }: Props) {
  const Empty = <div className={styles.empty}>No rss source found</div>

  const Loading = <div className={styles.loader}><LoaderIcon width={60} height={60} /></div>

  const List = rssSources.map(rssSource => (
    <RssSourceCard
      key={rssSource.uuid}
      rssSource={rssSource}
      fallowRssSource={fallowSource}
    />
  ))

  const list = rssSources.length > 0 ? List : Empty

  const content = loading ? Loading : list

  return <div className={styles.rssSourcesList}>{content}</div>
}
