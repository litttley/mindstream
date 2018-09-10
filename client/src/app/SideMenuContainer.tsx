import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { AppActions } from "app/AppActions"
import { Actions } from "Actions"
import SideMenu from "components/SideMenu"
import { GlobalState } from "Store"

interface DispatchProps {
  menuToggle(): void
}

interface StateProps {
  isMenuOpen: boolean
}

interface OwnProps {
  renderMenu: () => React.ReactNode
}

type Props = OwnProps & StateProps & DispatchProps

class SideMenuContainer extends React.PureComponent<Props> {
  render() {
    const { isMenuOpen, menuToggle, renderMenu, children } = this.props
    return (
      <SideMenu isMenuOpen={isMenuOpen} menuToggle={menuToggle} renderMenu={renderMenu}>
        {children}
      </SideMenu>
    )
  }
}

const mapStateToProps = (state: GlobalState, props: OwnProps): StateProps & OwnProps => {
  return {
    isMenuOpen: state.app.isMenuOpen,
    renderMenu: props.renderMenu
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    menuToggle: () => dispatch(AppActions.menuToggle()),
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(SideMenuContainer)
