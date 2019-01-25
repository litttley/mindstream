import * as React from "react"
import classNames from "classnames"
import * as styles from "./Layout.css"
import Header from "./Header"
import Menu from "~/components/Menu"
import MyRssSources from "~/rssSources/components/MyRssSources"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { useMenuToggle } from "~/app/AppState"
import { useMyRssSources } from "~/rssSources/RssSourcesState"
import { api } from "~/services/Api"
import * as router from "~/router"

const Layout: React.FunctionComponent = ({ children }) => {
  const { loadMySources, myRssSources } = useMyRssSources()
  React.useEffect(() => {
    loadMySources()
  }, [])
  const titleLabel = useIntlMessage("myRssSources")
  const { isMenuOpen, menuToggle } = useMenuToggle()
  return (
    <div className={styles.layout}>
      <div className={classNames(styles.menu, { [styles.menuOpen]: isMenuOpen })}>
        <Menu logout={() => api.logout().then(() => router.replace("/login"))} />
        <MyRssSources title={titleLabel} myRssSources={myRssSources} />
      </div>
      <div className={classNames(styles.header, { [styles.headerMenuOpen]: isMenuOpen })}>
        <Header appName="Mindstream" isMenuOpen={isMenuOpen} onMenuToggle={menuToggle} />
      </div>
      <div className={classNames(styles.content, { [styles.contentMenuOpen]: isMenuOpen })}>
        {children}
      </div>
    </div>
  )
}

export default Layout
