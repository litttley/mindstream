import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { useIntlMessage } from "~/hooks/useIntlMessage"
import { colors } from "~/guideStyles"

interface Props {
  logout: () => void
}

export function Menu({ logout }: Props) {
  const message = useIntlMessage()

  return (
    <div className={css(styles.menuContainer)}>
      <div className={css(styles.links)}>
        <a className={css(styles.item)} href="#/">
          {message("menu.home")}
        </a>
        <a className={css(styles.item)} href="#/rss/feeds/liked">
          {message("menu.feeds")}
        </a>
        <a className={css(styles.item)} href="#/rss/sources">
          {message("menu.rssSources")}
        </a>
        <a className={css(styles.item)} onClick={logout}>
          {message("menu.logout")}
        </a>
      </div>
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  menuContainer: {
    paddingTop: 10
  },
  links: {
    display: "flex",
    flexDirection: "column"
  },
  item: {
    textDecoration: "none",
    color: colors.primary,
    padding: "10px 20px",
    cursor: "pointer",
    ":hover": {
      color: colors.accent
    }
  }
})
