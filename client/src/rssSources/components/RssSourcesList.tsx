import * as React from "react"
import * as styles from "./RssSourcesList.css"
import { RssSource } from "~/models/RssSource"
import { RssSourceCard } from "./RssSourceCard"
import { Empty } from "~/components/Empty"
import { Loader } from "~/components/Loader"
import { useMyRssSources } from "../RssSourcesState"

interface Props {
  loading: boolean
  rssSources: RssSource[]
  followSource: (rssSource: RssSource) => void
}

export function RssSourcesList({ rssSources, followSource, loading }: Props) {
  const { isFollowed } = useMyRssSources()
  const List = rssSources.map(rssSource => (
    <RssSourceCard
      isFollowed={isFollowed(rssSource)}
      key={rssSource.uuid}
      rssSource={rssSource}
      followRssSource={followSource}
      unfollowRssSource={() => { /* TODO */ }}
    />
  ))

  const list = rssSources.length > 0 ? List : <Empty message="No rss source found" />

  const content = loading ? <Loader /> : list

  return <div className={styles.rssSourcesList}>{content}</div>
}
