import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { FeedAction } from "./FeedAction"
import { NextIcon } from "~/components/icons/NextIcon"
import { PreviousIcon } from "~/components/icons/PreviousIcon"
import { colors } from "~/guideStyles"

interface Props {
  previusLoading?: boolean
  nextLoading: boolean
  onPrevious: () => void
  onNext: () => void
}

export function FeedActions({ previusLoading  = false, nextLoading, onNext, onPrevious }: Props) {
  return (
    <div className={css(styles.container)}>
      <FeedAction
        style={styles.actionPrevious}
        icon={<PreviousIcon />}
        loading={previusLoading}
        onClick={onPrevious}
      />
      <FeedAction
        style={styles.actionNext}
        icon={<NextIcon />}
        loading={nextLoading}
        onClick={onNext}
      />
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  container: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    bottom: 20,
    right: 20,
    position: "fixed",
    zIndex: 1000,
    width: "calc(60px * 2 + 20px)",
  },
  actionNext: {
    backgroundColor: colors.accent,
    ":hover": {
      backgroundColor: colors.accentClear,
    },
  },
  actionPrevious: {
    backgroundColor: colors.secondary,
    ":hover": {
      backgroundColor: colors.secondaryClear,
    },
  },
})
