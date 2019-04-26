import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"
import { GhostdButton } from "~/components/buttons/GhostButton"
import { useIntlMessage } from "~/hooks/useIntlMessage"

export function NoMyRssSources() {
  const message = useIntlMessage()

  return (
    <div className={css(styles.noMyRssSources)}>
      <GhostdButton label={message("searchNewRssSources")} href="#/rss/sources" />
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  noMyRssSources: {
    display: "flex",
    justifyContent: "center",
    padding: 20,
  },
})
