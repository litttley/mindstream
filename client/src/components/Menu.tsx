import * as React from "react"
import * as styles from "./Menu.css"
import { InjectedIntlProps, injectIntl } from "react-intl"

interface Props {
  logout: () => void
}

class Menu extends React.PureComponent<Props & InjectedIntlProps> {
  render() {
    const { logout, intl } = this.props
    return (
      <div className={styles.menuContainer}>
        <div className={styles.links}>
          <a className={styles.item} href="#/">{intl.formatMessage({ id: "menu.home" })}</a>
          <a className={styles.item} href="#/feeds">{intl.formatMessage({ id: "menu.feeds" })}</a>
          <a className={styles.item} href="#/sources">{intl.formatMessage({ id: "menu.rssSources" })}</a>
          <a className={styles.item} onClick={logout}>{intl.formatMessage({ id: "menu.logout" })}</a>
        </div>
      </div>
    )
  }
}

export default injectIntl(Menu)
