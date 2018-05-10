import { Epic, combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of, empty } from "rxjs"
import { filter, switchMap, map, catchError } from "rxjs/operators"

import { LoginActions } from "login/LoginActions"
import { GlobalState, Dependencies } from "app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"
import * as router from "router"

type EpicType = Epic<Actions, GlobalState, Dependencies>

const loginSubmitEpic: EpicType = (action$, _, { api }) => action$.pipe(
    filter(isActionOf(LoginActions.loginSubmit)),
    switchMap(({ payload: { email, password } }) => api.login(email, password).pipe(
        map(auth => LoginActions.loginSubmitSuccess({ auth })),
        catchError((error: ApiError) => of(LoginActions.loginSubmitError({ error }))),
    )),
)

const loginSuccessEpic: EpicType = action$ => action$.pipe(
    filter(isActionOf(LoginActions.loginSubmitSuccess)),
    switchMap(() => {
        router.replace("/")
        return empty()
    })
)

export const loginEpics = combineEpics(loginSubmitEpic, loginSuccessEpic)
