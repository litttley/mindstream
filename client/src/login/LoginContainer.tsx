import * as React from "react"
import * as styles from "./components/Login.css"
import { connect, Dispatch } from "react-redux"
import { LoginActions } from "./LoginActions"
import { GlobalState } from "../app/AppState"
import LoginForm from "./components/LoginForm"
import { Actions } from "Actions"

interface Props extends GlobalState {
    onChange(field: string, value: string): void
    onSubmit(email: string, password: string): () => void
}
const LoginContainer: React.SFC<Props> = ({ login, onChange, onSubmit }) => {
    const { email, password, loading, error } = login
    return (
        <div className={styles.container}>
            <h2 className={styles.appName}>Mindstream</h2>
            <LoginForm
                email={email}
                password={password}
                loading={loading}
                error={error}
                onChange={onChange}
                onSubmit={onSubmit}
            />
            <a href="#/signup">Signup</a>
        </div>
    )
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>) => {
    return {
        onChange: (field: string, value: string) => {
            dispatch(LoginActions.loginChange(field, value))
        },
        onSubmit: (email: string, password: string) => {
            dispatch(LoginActions.loginSubmit(email, password))
        }
    }
}

const mapStateToProps = (state: GlobalState) => state
export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
