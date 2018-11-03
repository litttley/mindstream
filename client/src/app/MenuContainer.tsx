import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { AppActions } from "~/app/AppActions"
import { Actions } from "~/Actions"
import Menu from "~/app/Menu"
import { GlobalState } from "~/Store"
import { MyRssSource } from "~/models/RssSource"
import MyRssSources from "~/rssSources/components/MyRssSources"

interface DispatchProps {
  logout: () => void
}

interface StateProps {
  loading: boolean
  myRssSources: MyRssSource[]
}

type Props = StateProps & DispatchProps

class MenuContainer extends React.PureComponent<Props> {
  render() {
    const { logout, loading, myRssSources } = this.props
    return (
      <>
      <Menu logout={logout} />
      {loading ? <div>Loading</div> : <MyRssSources myRssSources={myRssSources} />}
      </>
    )
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  const { myRssSources, loading } = state.sources
  return { myRssSources, loading }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    logout: () => dispatch(AppActions.logout())
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(MenuContainer)
