import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { colors } from "~/guideStyles"

interface Props {
  message: string
}

export function Empty({ message }: Props) {
  return (
    <div className={css(styles.empty)}>{message}</div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  empty: {
    fontSize: "1rem",
    color: colors.secondary,
    textAlign: "center",
    padding: 30,
  },
})
