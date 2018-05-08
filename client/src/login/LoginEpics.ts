import { Epic, combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { Observable } from "rxjs"

import { LoginActions } from "login/LoginActions"
import { GlobalState, Dependencies } from "app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"
import * as router from "router"

type EpicType = Epic<Actions, GlobalState, Dependencies>

export const loginSubmitEpic: EpicType = (action$, _, dependencies) => {
    return action$
        .filter(isActionOf(LoginActions.loginSubmit))
        .concatMap(({ payload: { email, password } }) =>
            dependencies.api.login(email, password)
                .map(auth => LoginActions.loginSubmitSuccess({ auth }))
                .catch((error: ApiError) => Observable.of(LoginActions.loginSubmitError({ error })))
        )
}

export const loginSuccessEpic: EpicType = action$ => {
    return action$
        .filter(isActionOf(LoginActions.loginSubmitSuccess))
        .concatMap(() => {
            router.replace("/")
            return Observable.empty()
        })
}

export const loginEpics = combineEpics(loginSubmitEpic, loginSuccessEpic)
