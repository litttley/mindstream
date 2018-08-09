import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"

import { GlobalState } from "app/AppState"
import SignupForm from "auth/components/SignupForm"
import { Actions } from "Actions"
import { Signup } from "auth/Signup"
import { AuthActions } from "auth/AuthActions"
import { ApiError } from "services/ApiError"
import AuthLayout from "auth/components/AuthLayout"

interface StateProps {
  loading: boolean
  errors?: ApiError
}

interface DispatchProps {
  onSubmit: (signup: Signup) => void
}

type Props = StateProps & DispatchProps

const SignupContainer: React.SFC<Props> = ({ loading, errors, onSubmit }) => {
  return (
    <AuthLayout>
      <SignupForm
        loading={loading}
        errors={errors}
        onSubmit={onSubmit}
      />
      <a href="#/login">Login</a>
    </AuthLayout>
  )
}

const mapDispatchToProps = (dispatch: Dispatch<Actions>): DispatchProps => {
  return {
    onSubmit: signup => dispatch(AuthActions.signupSubmit.request(signup)),
  }
}

const mapStateToProps = (state: GlobalState): StateProps => {
  const { loading, signupErrors } = state.auth
  return { loading, errors: signupErrors }
}

export default connect(mapStateToProps, mapDispatchToProps)(SignupContainer)
