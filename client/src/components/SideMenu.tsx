import * as React from "react"
import * as styles from "./SideMenu.css"
import classNames from "utils/classNames"

interface Props {
  isMenuOpen: boolean
  menuToggle: () => void
  renderMenu: () => React.ReactNode
}

export default class SideMenu extends React.PureComponent<Props> {
  render() {
    const { isMenuOpen, children, renderMenu } = this.props
    const sidenavClasses = classNames({
      [styles.sidenav]: true,
      [styles.sidenavOpen]: isMenuOpen,
      [styles.sidenavClose]: !isMenuOpen,
    })
    const contentClasses = classNames({
      [styles.content]: true,
      [styles.contentOpen]: isMenuOpen,
      [styles.contentClose]: !isMenuOpen,
    })
    return (
      <div className={styles.sidenavContainer}>
        <div className={sidenavClasses}>{renderMenu()}</div>
        <div className={contentClasses}>{children}</div>
      </div>
    )
  }
}
