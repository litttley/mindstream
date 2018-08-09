import * as React from "react"
import * as styles from "./SignupForm.css"
import Input from "components/Input"
import ContainedButton from "components/buttons/ContainedButton"
import { ApiError } from "services/ApiError"
import { Signup } from "auth/Signup"

interface Props {
  loading: boolean
  errors?: ApiError
  onSubmit: (signup: Signup) => void
}

export default class SignupForm extends React.Component<Props, Signup> {
  state = {
    login: "",
    email: "",
    password: "",
  }

  render() {
    const { login, email, password } = this.state
    const { loading } = this.props
    return (
      <div className={styles.signupForm}>
        <Input
          label="Login"
          value={login}
          onChange={this.handleOnChange("login")}
          type="text"
        />

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
    const { errors } = this.props
    return (
      <div className={styles.errorContainer}>
        <div className={errors && errors.message ? styles.errorMessage : styles.errorMessageHidden}>
          {errors && errors.message || ""}
        </div>
      </div>
    )
  }

  handleOnChange = (field: keyof Signup) => (value: string) => {
    this.setState(() => ({
      [field]: value
    } as Pick<Signup, keyof Signup>))
  }

  handleOnSubmit = () => this.props.onSubmit(this.state)
}
