import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import * as styles from "./LoginContainer.css"
import { GlobalState } from "app/AppState"
import { Actions } from "Actions"
import { AuthActions } from "auth/AuthActions"
import LoginForm from "auth/components/LoginForm"
import { Login } from "auth/Login"
import { ApiError } from "services/ApiError"

interface StateProps {
    loading: boolean
    errors?: ApiError
}

interface DispatchProps {
    onSubmit: (login: Login) => void
}

type Props = DispatchProps & StateProps

const LoginContainer: React.SFC<Props> = ({ onSubmit, loading, errors }) => {
    return (
        <div className={styles.container}>
            <h2 className={styles.appName}>Mindstream</h2>
            <LoginForm
                loading={loading}
                errors={errors}
                onSubmit={onSubmit}
            />
            <a href="#/signup">Signup</a>
        </div>
    )
}

function mapDispatchToProps(dispatch: Dispatch<Actions>): DispatchProps {
    return {
        onSubmit: login => dispatch(AuthActions.loginSubmit.request(login))
    }
}

function mapStateToProps(state: GlobalState): StateProps {
    const { errors, loading } = state.auth
    return { errors, loading }
}
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
