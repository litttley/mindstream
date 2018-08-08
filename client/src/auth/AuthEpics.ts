import { Epic, combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of, empty } from "rxjs"
import { filter, switchMap, map, catchError } from "rxjs/operators"

import { GlobalState, Dependencies } from "app/AppState"
import { Actions } from "Actions"
import { ApiError } from "services/ApiError"
import * as router from "router"
import { AuthActions } from "auth/AuthActions"

type EpicType = Epic<Actions, Actions, GlobalState, Dependencies>

const loginSubmitEpic: EpicType = (action$, _, { api }) => action$.pipe(
  filter(isActionOf(AuthActions.loginSubmit.request)),
  switchMap(({ payload: login }) => api.login(login).pipe(
    map(AuthActions.loginSubmit.success),
    catchError((error: ApiError) => of(AuthActions.loginSubmit.failure(error))),
  )),
)

const signupSubmitEpic: EpicType = (action$, _, { api }) => action$.pipe(
  filter(isActionOf(AuthActions.signupSubmit.request)),
  switchMap(({ payload: signup }) => api.signup(signup).pipe(
    map(AuthActions.signupSubmit.success),
    catchError((error: ApiError) => of(AuthActions.signupSubmit.failure(error)))
  ))
)

const signupSuccessEpic: EpicType = action$ => action$.pipe(
  filter(isActionOf(AuthActions.signupSubmit.success)),
  switchMap(() => {
    router.replace("/")
    return empty()
  })
)

const loginSuccessEpic: EpicType = action$ => action$.pipe(
  filter(isActionOf(AuthActions.loginSubmit.success)),
  switchMap(() => {
    router.replace("/")
    return empty()
  })
)

export const authEpics = combineEpics(loginSubmitEpic, loginSuccessEpic, signupSubmitEpic, signupSuccessEpic)
