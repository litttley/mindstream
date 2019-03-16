import * as React from "react"
import * as styles from "./Header.css"
import { MenuIcon } from "./icons/MenuIcon"

interface Props {
  appName: string
  onMenuToggle(isMenuOpen: boolean): void
  isMenuOpen?: boolean
}

export function Header({ appName, onMenuToggle, isMenuOpen }: Props) {
  const handleOnMenuToggle = React.useCallback(() =>
    onMenuToggle(!isMenuOpen), [isMenuOpen]
  )

  return (
    <div className={styles.header}>
      <div className={styles.menuToggle} onClick={handleOnMenuToggle}>
        <MenuIcon />
      </div>
      <div className={styles.appName}>
        <div>{appName}</div>
      </div>
    </div>
  )
}
