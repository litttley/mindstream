import * as React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"
import * as styles from "./LoginForm.css"
import Input from "components/Input"
import ContainedButton from "components/buttons/ContainedButton"
import { ApiErrors, getFieldErrorMessage } from "services/ApiError"
import { Login } from "auth/Login"

interface Props {
  loading: boolean
  errors?: ApiErrors
  onSubmit: (login: Login) => void
}

class LoginForm extends React.Component<Props & InjectedIntlProps, Login> {
  state = {
    email: "",
    password: ""
  }

  render() {
    const { email, password } = this.state
    const { errors, loading, intl } = this.props
    return (
      <div className={styles.loginForm}>
        <Input
          name="email"
          error={getFieldErrorMessage("email", intl, errors)}
          label={intl.formatMessage({ id: "email" })}
          value={email}
          onChange={this.handleOnChange}
          type="email"
        />

        <Input
          name="password"
          label="Password"
          error={getFieldErrorMessage("password", intl, errors)}
          value={password}
          onChange={this.handleOnChange}
          type="password"
        />

        <ContainedButton
          label="Login"
          loading={loading}
          onClick={this.handleOnSubmit}
        />

        {this.renderError()}
      </div>
    )
  }

  renderError = () => {
    const { errors, intl } = this.props
    return (
      <div className={styles.errorContainer}>
        <div className={errors && errors.message ? styles.errorMessage : styles.errorMessageHidden}>
          {errors && intl.formatMessage({ id: errors.message }) || ""}
        </div>
      </div>
    )
  }

  handleOnChange = (value: string, field: keyof Login) => {
    this.setState(() => ({
      [field]: value
    } as Pick<Login, keyof Login>))
  }

  handleOnSubmit = () => this.props.onSubmit(this.state)
}

export default injectIntl(LoginForm)
