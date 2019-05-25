import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { useMenuToggle } from "~/states/AppState"
import { useMyRssSources } from "~/rssSources/RssSourcesState"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { colors } from "~/guideStyles"
import { api } from "~/services/api"
import * as router from "~/router"
import { Header } from "./Header"
import { Menu } from "~/components/Menu"
import { Loader } from "./Loader"
import { MyRssSources } from "~/rssSources/components/MyRssSources"
import { NoMyRssSources } from "~/rssSources/components/NoMyRssSources"

export function Layout({ children }: React.PropsWithChildren<{}>) {
  const { isMenuOpen, menuToggle } = useMenuToggle()
  const { loadMySources, myRssSources, loadMySourcesLoading } = useMyRssSources()
  const message = useIntlMessage()

  React.useEffect(() => {
    loadMySources()
  }, [])

  const renderMyRssSources = () => {
    if (loadMySourcesLoading) {
      return <Loader size={30} />
    } else if (myRssSources.length === 0) {
      return <NoMyRssSources />
    } else {
      return <MyRssSources title={message("myRssSources")} myRssSources={myRssSources} />
    }
  }

  const logout = React.useCallback(() => api.logout().then(() => router.replace("/login")), [])

  return (
    <div className={css(styles.layout)}>
      <div className={css(styles.menu, isMenuOpen ? styles.menuOpen : undefined)}>
        <Menu logout={logout} />
        {renderMyRssSources()}
      </div>
      <div className={css(styles.header, isMenuOpen ? styles.headerMenuOpen : undefined)}>
        <Header appName="Mindstream" isMenuOpen={isMenuOpen} onMenuToggle={menuToggle} />
      </div>
      <div className={css(styles.content, isMenuOpen ? styles.contentMenuOpen : undefined)}>{children}</div>
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  layout: {
    display: "flex",
    flexDirection: "row"
  },
  header: {
    position: "fixed",
    height: 55,
    top: 0,
    left: 0,
    right: 0,
    transition: "margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms"
  },
  headerMenuOpen: {
    marginLeft: 260
  },
  menu: {
    position: "fixed",
    top: 0,
    bottom: 0,
    left: 0,
    width: 260,
    overflowY: "auto",
    transition: "margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms",
    backgroundColor: colors.primaryClear,
    marginLeft: -260,
    borderRightWidth: 1,
    borderRightStyle: "solid",
    borderRightColor: colors.secondaryClear
  },
  menuOpen: {
    marginLeft: 0
  },
  content: {
    width: "100%",
    flexGrow: 1,
    backgroundColor: colors.primaryClear,
    marginTop: 60,
    transition: "margin 195ms cubic-bezier(0.4, 0, 0.6, 1) 0ms"
  },
  contentMenuOpen: {
    marginLeft: 0,
    "@media screen and (min-width: 480px)": {
      marginLeft: 260
    }
  }
})
