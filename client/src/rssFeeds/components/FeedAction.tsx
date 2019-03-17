import * as React from "react"
import { StyleSheet, CSSProperties, StyleDeclarationValue } from "aphrodite/no-important"
import { IconButton } from "~/components/buttons/IconButton"
import { colors } from "~/guideStyles"

interface FeedActionProps {
  icon: React.ReactNode
  loading: boolean
  style: StyleDeclarationValue
  onClick: () => void
}

export function FeedAction({ icon, loading, style, onClick }: FeedActionProps) {
  return (
    <IconButton style={[styles.action, style]} loading={loading} onClick={onClick}>
      {icon}
    </IconButton>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  action: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    width: 60,
    height: 60,
    borderRadius: 30,
    border: "none",
    fontSize: ".8rem",
    cursor: "pointer",
    fontWeight: "bold",
    textTransform: "uppercase",
    color: colors.primaryClear,
  },
})
