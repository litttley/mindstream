import * as React from "react"
import * as styles from "./Menu.css"
import { useIntlMessage } from "~/hooks/useIntlMessage"

interface Props {
  logout: () => void
}

export default function Menu({ logout }: Props) {
  const message = useIntlMessage()
  return (
    <div className={styles.menuContainer}>
      <div className={styles.links}>
        <a className={styles.item} href="#/">{message("menu.home")}</a>
        <a className={styles.item} href="#/rss/feeds/liked">{message("menu.feeds")}</a>
        <a className={styles.item} href="#/rss/sources">{message("menu.rssSources")}</a>
        <a className={styles.item} onClick={logout}>{message("menu.logout")}</a>
      </div>
    </div>
  )
}
