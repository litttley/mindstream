import { Epic, combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of, empty } from "rxjs"
import { filter, switchMap, map, catchError } from "rxjs/operators"

import { SignupActions } from "signup/SignupActions"
import { GlobalState, Dependencies } from "app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"
import * as router from "router"

type EpicType = Epic<Actions, Actions, GlobalState, Dependencies>

const signupEpic: EpicType = (action$, _, { api }) => action$.pipe(
    filter(isActionOf(SignupActions.signupSubmit)),
    switchMap(({ payload: { login, email, password } }) => api.signup(login, email, password).pipe(
        map(SignupActions.signupSubmitSuccess),
        catchError((error: ApiError) => of(SignupActions.signupSubmitError(error)))
    ))
)

const signupSuccessEpic: EpicType = action$ => action$.pipe(
    filter(isActionOf(SignupActions.signupSubmitSuccess)),
    switchMap(() => {
        router.replace("/")
        return empty()
    })
)

export const signupEpics = combineEpics(signupEpic, signupSuccessEpic)
