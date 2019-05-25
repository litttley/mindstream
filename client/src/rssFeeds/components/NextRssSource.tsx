import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { useMyRssSources } from "~/rssSources/RssSourcesState"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { GhostdButton } from "~/components/buttons/GhostButton"

interface Props {
  rssSourceUuid: string
}

export function NextRssSource({ rssSourceUuid }: Props) {
  const { myRssSources } = useMyRssSources()
  const message = useIntlMessage()
  const index = myRssSources.findIndex(s => s.rss_source.uuid === rssSourceUuid)
  const nextRssSource = myRssSources.length > index ? myRssSources[index + 1] : undefined

  return (
    <div className={css(styles.nextRssSource)}>
      {nextRssSource ? (
        <GhostdButton label={message("nextRssSource")} href={`/#/rss/feeds/${nextRssSource.rss_source.uuid}`} />
      ) : (
        undefined
      )}
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  nextRssSource: {
    display: "flex",
    justifyContent: "center"
  }
})
