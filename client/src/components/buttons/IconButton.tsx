import * as React from "react"
import { StyleSheet, CSSProperties, StyleDeclarationValue } from "aphrodite/no-important"

import { BaseButton } from "~/components/buttons/BaseButton"

interface Props {
  loading?: boolean
  disable?: boolean
  href?: string
  style?: StyleDeclarationValue
  onClick?: () => void
}

export function IconButton({ children, loading, disable, href, onClick, style }: React.PropsWithChildren<Props>) {
  return (
    <BaseButton
      loading={loading}
      style={[styles.iconButton, style]}
      disable={disable}
      href={href}
      onClick={onClick}
    >
      {children}
    </BaseButton>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  iconButton: {
    border: "none",
    padding: 0,
    margin: 0,
  },
})
