import * as React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"
import * as styles from "./SignupForm.css"
import Input from "~/components/Input"
import ContainedButton from "~/components/buttons/ContainedButton"
import { ApiErrors, getFieldErrorMessage } from "~/services/ApiError"
import { Signup } from "~/auth/Signup"

interface Props {
  loading: boolean
  errors?: ApiErrors
  onSubmit: (signup: Signup) => void
}

class SignupForm extends React.Component<Props & InjectedIntlProps, Signup> {
  state = {
    login: "",
    email: "",
    password: "",
  }

  render() {
    const { login, email, password } = this.state
    const { loading, errors, intl } = this.props
    return (
      <div className={styles.signupForm}>
        <Input
          name="login"
          label="Login"
          error={getFieldErrorMessage("login", intl, errors)}
          value={login}
          onChange={this.handleOnChange}
          type="text"
        />

        <Input
          name="email"
          label="Email"
          error={getFieldErrorMessage("email", intl, errors)}
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
          label="Signup"
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

  handleOnChange = (value: string, field: keyof Signup) => {
    this.setState(() => ({
      [field]: value
    } as Pick<Signup, keyof Signup>))
  }

  handleOnSubmit = () => this.props.onSubmit(this.state)
}

export default injectIntl(SignupForm)
