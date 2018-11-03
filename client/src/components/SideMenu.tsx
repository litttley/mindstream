import * as React from "react"
import * as styles from "./SideMenu.css"
import classNames from "~/utils/classNames"
import CloseIcon from "~/components/icons/CloseIcon"
import BaseButton from "~/components/buttons/BaseButton"

interface Props {
  isMenuOpen: boolean
  menuToggle: () => void
  renderMenu: () => React.ReactNode
}

export default class SideMenu extends React.PureComponent<Props> {
  render() {
    const { isMenuOpen, children, renderMenu, menuToggle } = this.props
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
        <div className={sidenavClasses}>
          <BaseButton className={styles.close} onClick={menuToggle}><CloseIcon color="#FFFFFF" /></BaseButton>
          {renderMenu()}
        </div>
        <div className={contentClasses}>{children}</div>
      </div>
    )
  }
}
