import * as React from "react"

import * as styles from "./SideMenu.css"

interface Props {
  isMenuOpen: boolean
  menuToggle: () => void
  renderMenu: () => React.ReactNode
}

export default class SideMenu extends React.PureComponent<Props> {
  render() {
    const { isMenuOpen, children, renderMenu } = this.props
    return (
      <div className={styles.sidenavContainer}>
        <div className={styles.sidenav} style={{ width: isMenuOpen ? 250 : 0 }}>{renderMenu()}</div>
        <div className={styles.content} style={{ marginLeft: isMenuOpen ? 250 : 0 }}>{children}</div>
      </div>
    )
  }
}
