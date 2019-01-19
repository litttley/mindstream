import * as React from "react"
import { InjectedIntlProps, injectIntl } from "react-intl"
import * as styles from "./SignupForm.css"
import Input from "~/components/Input"
import { ApiErrors, getFieldErrorMessage } from "~/services/ApiError"
import { Signup } from "~/auth/Signup"
import GhostdButton from "~/components/buttons/GhostButton"
import KeyDownAction from "~/components/KeyDownAction"

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
          label={intl.formatMessage({ id: "login" })}
          error={getFieldErrorMessage("login", intl, errors)}
          value={login}
          onChange={this.handleOnChange}
          type="text"
        />

        <Input
          name="email"
          label={intl.formatMessage({ id: "email" })}
          error={getFieldErrorMessage("email", intl, errors)}
          value={email}
          onChange={this.handleOnChange}
          type="email"
        />

        <Input
          name="password"
          label={intl.formatMessage({ id: "password" })}
          error={getFieldErrorMessage("password", intl, errors)}
          value={password}
          onChange={this.handleOnChange}
          type="password"
        />

        <GhostdButton
          className={styles.button}
          label={intl.formatMessage({ id: "auth.signup" })}
          loading={loading}
          onClick={this.handleOnSubmit}
        />

        {this.renderError()}

        <KeyDownAction onKeyDown={this.hendleOnKeyDown} />
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

  hendleOnKeyDown = (event: KeyboardEvent) => {
    if (event.key === "Enter") {
      this.handleOnSubmit()
    }
  }
}

export default injectIntl(SignupForm)
