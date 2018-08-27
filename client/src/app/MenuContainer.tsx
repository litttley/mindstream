import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { GlobalState } from "app/AppState"
import { AppActions } from "app/AppActions"
import { Actions } from "Actions"
import Menu from "app/Menu"

interface DispatchProps {
}

interface StateProps {
}

interface OwnProps {
}

type Props = OwnProps & StateProps & DispatchProps

class MenuContainer extends React.PureComponent<Props> {
  render() {
    const { } = this.props
    return (
      <Menu />
    )
  }
}

const mapStateToProps = (state: GlobalState, props: OwnProps): StateProps & OwnProps => {
  return {
  }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
