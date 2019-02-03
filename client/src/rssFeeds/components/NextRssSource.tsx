import * as React from "react"
import * as styles from "./NextRssSource.css"
import GhostdButton from "~/components/buttons/GhostButton"
import { useMyRssSources } from "~/rssSources/RssSourcesState"
import { useIntlMessage } from "~/hooks/useIntlMessage"

interface Props {
  rssSourceUuid: string
}

export default function NextRssSource({ rssSourceUuid }: Props) {
  const { myRssSources } = useMyRssSources()
  const message = useIntlMessage()
  const index = myRssSources.findIndex(s => s.rss_source.uuid === rssSourceUuid)
  const nextRssSource = myRssSources.length > index ? myRssSources[index + 1] : undefined
  return (
    <div className={styles.nextRssSource}>
      {nextRssSource
        ? <GhostdButton label={message("nextRssSource")} href={`/#/rss/feeds/${nextRssSource.rss_source.uuid}`} />
        : undefined}

    </div>
  )
}
