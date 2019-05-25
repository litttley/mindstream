import * as React from "react"
import { StyleSheet, CSSProperties, StyleDeclarationValue } from "aphrodite/no-important"
import { BaseButton } from "~/components/buttons/BaseButton"
import { colors } from "~/guideStyles"

interface Props {
  label: string
  loading?: boolean
  disable?: boolean
  onClick?: () => void
  href?: string
  style?: StyleDeclarationValue
}

export function GhostdButton({ href, label, loading, disable, onClick, style }: Props) {
  return (
    <BaseButton style={[styles.ghostButton, style]} loading={loading} disable={disable} href={href} onClick={onClick}>
      {label}
    </BaseButton>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  ghostButton: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    cursor: "pointer",
    padding: "3px 20px",
    backgroundColor: "transparent",
    fontSize: "1rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.primary,
    color: colors.primary,
    textTransform: "uppercase",
    transitionDelay: ".05s",

    ":hover": {
      backgroundColor: colors.primary,
      color: colors.primaryClear
    },
    ":focus": {
      backgroundColor: colors.primary,
      color: colors.primaryClear
    }
  },
  "ghostButton path": {
    fill: colors.primary
  },
  "ghostButton:hover path": {
    fill: colors.primaryClear
  }
})
