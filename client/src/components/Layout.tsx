import * as React from "react"
import * as styles from "./Layout.css"
import { connect } from "react-redux"
import { Dispatch } from "redux"

import classNames from "~/utils/classNames"
import { GlobalState } from "~/Store"
import { Actions } from "~/Actions"
import { AppActions } from "~/app/AppActions"
import Header from "./Header"
import Menu from "~/components/Menu"
import { MyRssSource } from "~/models/RssSource"
import MyRssSources from "~/rssSources/components/MyRssSources"

interface StateProps {
  isMenuOpen: boolean
  myRssSources: MyRssSource[]
}

interface DispatchProps {
  menuToggle: () => void
  logout: () => void
}

type Props = DispatchProps & StateProps

const Layout: React.FunctionComponent<Props> = ({ isMenuOpen, myRssSources, menuToggle, logout, children }) => {
  const menuClasses = classNames({
    [styles.menu]: true,
    [styles.menuOpen]: isMenuOpen,
  })
  const contentClasses = classNames({
    [styles.content]: true,
    [styles.contentMenuOpen]: isMenuOpen,
  })
  const headerClasses = classNames({
    [styles.header]: true,
    [styles.headerMenuOpen]: isMenuOpen,
  })
  return (
    <div className={styles.layout}>
      <div className={menuClasses}>
        <Menu logout={logout} />
        <MyRssSources myRssSources={myRssSources} />
      </div>
      <div className={headerClasses}>
        <Header appName="Mindstream" isMenuOpen={isMenuOpen} onMenuToggle={menuToggle} />
      </div>
      <div className={contentClasses}>
        {children}
      </div>
    </div>
  )
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    isMenuOpen: state.app.isMenuOpen,
    myRssSources: state.sources.myRssSources,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    menuToggle: () => dispatch(AppActions.menuToggle()),
    logout: () => dispatch(AppActions.logout()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Layout)
