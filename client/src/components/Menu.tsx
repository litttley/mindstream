import * as React from "react"
import * as styles from "./Menu.css"
import { useIntlMessage } from "~/hooks/useIntlMessage"

interface Props {
  logout: () => void
}

export default function Menu({ logout }: Props) {
  const homeLabel = useIntlMessage("menu.home")
  const feedsLabel = useIntlMessage("menu.feeds")
  const rssSourcesLabel = useIntlMessage("menu.rssSources")
  const logoutLabel = useIntlMessage("menu.logout")
  return (
    <div className={styles.menuContainer}>
      <div className={styles.links}>
        <a className={styles.item} href="#/">{homeLabel}</a>
        <a className={styles.item} href="#/rss/feeds/liked">{feedsLabel}</a>
        <a className={styles.item} href="#/rss/sources">{rssSourcesLabel}</a>
        <a className={styles.item} onClick={logout}>{logoutLabel}</a>
      </div>
    </div>
  )
}
