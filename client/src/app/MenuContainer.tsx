import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { AppActions } from "app/AppActions"
import { Actions } from "Actions"
import Menu from "app/Menu"
import { GlobalState } from "Store"

interface DispatchProps {
  logout: () => void
}

interface StateProps {
  // TODO
}

type Props = StateProps & DispatchProps

class MenuContainer extends React.PureComponent<Props> {
  render() {
    const { logout } = this.props
    return (
      <Menu logout={logout} />
    )
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  return {
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    logout: () => dispatch(AppActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
