import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { colors } from "~/guideStyles"

export function AuthLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className={css(styles.authLayout)}>
      <h1 className={css(styles.appName)}>Mindstream</h1>
      {children}
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  authLayout: {
    display: "flex",
    flex: 1,
    minHeight: "100vh",
    flexDirection: "column"
  },
  appName: {
    fontSize: "1.5rem",
    fontWeight: "bold",
    textAlign: "center",
    fontFamily: "'Times New Roman', Times, serif",
    textTransform: "uppercase",
    color: colors.primary,
    margin: "40px 0"
  }
})
