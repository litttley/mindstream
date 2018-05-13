import * as React from "react"
import { connect, Dispatch } from "react-redux"
import Header from "../components/Header"
import { GlobalState } from "../app/AppState"
import { AppActions } from "./AppActions"
import { Actions } from "Actions"

interface DispatchProps {
    menuToggle(isMenuOpen: boolean): void
    logout(): void
}

interface StateProps {
    isMenuOpen: boolean
}

type Props = StateProps & DispatchProps

const HeaderContainer: React.SFC<Props> = ({ logout, isMenuOpen, menuToggle }) => (
    <Header isMenuOpen={isMenuOpen} onMenuToggle={menuToggle} onLogout={logout} />
)

const mapStateToProps = (state: GlobalState): StateProps => {
    return {
        isMenuOpen: state.app.isMenuOpen,
    }
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
    return {
        menuToggle: (isMenuOpen) => dispatch(AppActions.menuToggle({ isMenuOpen })),
        logout: () => dispatch(AppActions.logout())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HeaderContainer)
