import { isActionOf } from "typesafe-actions"
import { Epic } from "redux-observable"
import { Observable } from "rxjs"
import { SignupActions } from "signup/SignupActions"
import { GlobalState, Dependencies } from "app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"
import * as router from "router"

type EpicType = Epic<Actions, GlobalState, Dependencies>

export const signupEpic: EpicType = (action$, _, dependencies) => {
    return action$
        .filter(isActionOf(SignupActions.signupSubmit))
        .mergeMap(({ payload: { login, email, password } }) =>
            dependencies.api.signup(login, email, password)
                .map(auth => SignupActions.signupSubmitSuccess({ auth }))
                .catch((error: ApiError) => Observable.of(SignupActions.signupSubmitError({ error })))
        )
}

export const signupSuccessEpic: EpicType = action$ => {
    return action$
        .filter(isActionOf(SignupActions.signupSubmitSuccess))
        .concatMap(() => {
            router.replace("/")
            return Observable.empty()
        })
}
