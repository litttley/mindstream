import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"

import { GlobalState } from "app/AppState"
import SignupForm from "auth/components/SignupForm"
import { Actions } from "Actions"
import { Signup } from "auth/Signup"
import { AuthActions } from "auth/AuthActions"
import { ApiErrors } from "services/ApiError"
import AuthLayout from "auth/components/AuthLayout"
import LinkButton from "components/buttons/LinkButton"

interface StateProps {
  loading: boolean
  errors?: ApiErrors
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
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LinkButton href="#/login">Login</LinkButton>
      </div>
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
