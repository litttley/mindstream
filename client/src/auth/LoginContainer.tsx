import * as React from "react"
import { Dispatch } from "redux"
import { connect } from "react-redux"
import { Actions } from "~/Actions"
import { AuthActions } from "~/auth/AuthActions"
import LoginForm from "~/auth/components/LoginForm"
import { ApiErrors } from "~/services/ApiError"
import AuthLayout from "~/auth/components/AuthLayout"
import LinkButton from "~/components/buttons/LinkButton"
import { GlobalState } from "~/Store"

interface StateProps {
  loading: boolean
  errors?: ApiErrors
}

interface DispatchProps {
  onSubmit: typeof AuthActions.loginSubmit.request
}

type Props = DispatchProps & StateProps

const LoginContainer: React.SFC<Props> = ({ onSubmit, loading, errors }) => {
  return (
    <AuthLayout>
      <LoginForm
        loading={loading}
        errors={errors}
        onSubmit={onSubmit}
      />
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LinkButton href="#/signup">Signup</LinkButton>
      </div>
    </AuthLayout>
  )
}

function mapDispatchToProps(dispatch: Dispatch<Actions>): DispatchProps {
  return {
    onSubmit: login => dispatch(AuthActions.loginSubmit.request(login))
  }
}

function mapStateToProps(state: GlobalState): StateProps {
  const { loginErrors, loading } = state.auth
  return { errors: loginErrors, loading }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginContainer)
