import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"

import Header from "components/Header"
import { AppActions } from "app/AppActions"
import { Actions } from "Actions"
import { GlobalState } from "Store"

interface DispatchProps {
  menuToggle(): void
  logout(): void
}

interface StateProps {
  isMenuOpen: boolean
}

type Props = StateProps & DispatchProps

const HeaderContainer: React.SFC<Props> = ({ logout, isMenuOpen, menuToggle }) => (
  <Header isMenuOpen={isMenuOpen} onMenuToggle={menuToggle} />
)

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
    isMenuOpen: state.app.isMenuOpen,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    menuToggle: () => dispatch(AppActions.menuToggle()),
    logout: () => dispatch(AppActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)
