import * as React from "react"
import * as styles from "./LoginForm.css"
import Input from "components/Input"
import GhostButton from "components/GhostButton"
import { ApiError } from "services/ApiError"
import { Login } from "auth/Login"

interface Props {
    loading: boolean
    errors?: ApiError
    onSubmit(login: Login): void
}

export default class LoginForm extends React.Component<Props, Login> {
    state = {
        email: "",
        password: ""
    }

    render() {
        const { email, password } = this.state
        const { loading } = this.props
        return (
            <div className={styles.container}>
                <Input
                    label="Email"
                    value={email}
                    onChange={this.handleOnChange("email")}
                    type="email"
                />

                <Input
                    label="Password"
                    value={password}
                    onChange={this.handleOnChange("password")}
                    type="password"
                />

                <GhostButton
                    label="Login"
                    loading={loading}
                    onClick={this.handleOnSubmit}
                />

                {this.renderError()}
            </div>
        )
    }

    renderError = () => {
        const { errors } = this.props
        return (
            <div className={styles.errorContainer}>
                <div className={errors && errors.message ? styles.errorMessage : styles.errorMessageHidden}>
                    {errors && errors.message || ""}
                </div>
            </div>
        )
    }

    handleOnChange = (field: keyof Login) => (value: string) => {
        this.setState(() => ({
            [field]: value
        } as Pick<Login, keyof Login>))
    }

    handleOnSubmit = () => this.props.onSubmit(this.state)
}
