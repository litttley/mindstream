import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { colors } from "~/guideStyles"
import { MenuIcon } from "./icons/MenuIcon"

interface Props {
  appName: string
  onMenuToggle(isMenuOpen: boolean): void
  isMenuOpen?: boolean
}

export function Header({ appName, isMenuOpen, onMenuToggle }: Props) {
  const handleOnMenuToggle = React.useCallback(() => onMenuToggle(!isMenuOpen), [isMenuOpen])

  return (
    <div className={css(styles.header)}>
      <div className={css(styles.menuToggle)} onClick={handleOnMenuToggle}>
        <MenuIcon />
      </div>
      <div className={css(styles.appName)}>
        <div>{appName}</div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  appName: {
    display: "flex",
    alignItems: "center"
  },
  header: {
    display: "flex",
    height: 55,
    alignContent: "center",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.secondaryClear,
    backgroundColor: colors.primaryClear,
    "@media screen and (min-width: 760px)": {
      display: "flex",
      alignContent: "center"
    }
  },
  menuToggle: {
    display: "flex",
    alignItems: "center",
    paddingLeft: 15,
    paddingRight: 15,
    cursor: "pointer"
  }
})
