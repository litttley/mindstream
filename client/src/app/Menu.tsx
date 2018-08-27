import * as React from "react"
import * as styles from "./Menu.css"

interface Props {
  logout: () => void
}

export default class Menu extends React.PureComponent<Props> {
  render() {
    const { logout } = this.props
    return (
      <div className={styles.menuContainer}>
        <div className={styles.links}>
          <a className={styles.item} href="#/">Mindstream</a>
          <a className={styles.item} href="#/feeds">Feeds</a>
          <a className={styles.item} href="#/sources">Sources</a>
          <a className={styles.item} onClick={logout}>Logout</a>
        </div>
      </div>
    )
  }
}
