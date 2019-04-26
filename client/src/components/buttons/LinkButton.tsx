import * as React from "react"
import { StyleSheet, CSSProperties } from "aphrodite/no-important"

import { colors } from "~/guideStyles"
import { BaseButton } from "~/components/buttons/BaseButton"

interface Props {
  disable?: boolean
  href?: string
  onClick?: () => void
}

export function LinkButton({ href, children, disable, onClick }: React.PropsWithChildren<Props>) {
  return (
    <BaseButton
      style={styles.linkButton}
      disable={disable}
      href={href}
      onClick={onClick}
    >
      {children}
    </BaseButton>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  linkButton: {
    color: colors.primary,
    ":hover": {
      textDecoration: "underline",
    },
    ":focus": {
      textDecoration: "underline",
    },
  },
})
