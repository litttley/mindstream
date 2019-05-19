import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { RssSource } from "~/models/rssSource"
import { RssSourceCard } from "./RssSourceCard"
import { Empty } from "~/components/Empty"
import { Loader } from "~/components/Loader"
import { useMyRssSources } from "../RssSourcesState"

interface Props {
  loading: boolean
  rssSources: RssSource[]
  followRssSource: (rssSource: RssSource) => void
  unfollowRssSource: (rssSource: RssSource) => void
}

export function RssSourcesList({ rssSources, followRssSource, unfollowRssSource, loading }: Props) {
  const { isFollowed } = useMyRssSources()

  const List = rssSources.map(rssSource => (
    <RssSourceCard
      isFollowed={isFollowed(rssSource)}
      key={rssSource.uuid}
      rssSource={rssSource}
      followRssSource={followRssSource}
      unfollowRssSource={unfollowRssSource}
    />
  ))

  const list = rssSources.length > 0 ? List : <Empty message="No rss source found" />

  const content = loading ? <Loader /> : list

  return <div className={css(styles.rssSourcesList)}>{content}</div>
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  rssSourcesList: {
    padding: 20,
  },
})
