import { combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { of, empty } from "rxjs"
import { filter, switchMap, map, catchError } from "rxjs/operators"

import { ApiErrors } from "services/ApiError"
import * as router from "router"
import { AuthActions } from "auth/AuthActions"
import { EpicType } from "EpicType"

const loginSubmitEpic: EpicType = (action$, _, { api }) => action$.pipe(
  filter(isActionOf(AuthActions.loginSubmit.request)),
  switchMap(({ payload: login }) => api.login(login).pipe(
    map(AuthActions.loginSubmit.success),
    catchError((error: ApiErrors) => of(AuthActions.loginSubmit.failure(error))),
  )),
)

const signupSubmitEpic: EpicType = (action$, _, { api }) => action$.pipe(
  filter(isActionOf(AuthActions.signupSubmit.request)),
  switchMap(({ payload: signup }) => api.signup(signup).pipe(
    map(AuthActions.signupSubmit.success),
    catchError((error: ApiErrors) => of(AuthActions.signupSubmit.failure(error)))
  ))
)

const authSuccessEpic: EpicType = action$ => action$.pipe(
  filter(isActionOf([AuthActions.signupSubmit.success, AuthActions.loginSubmit.success])),
  switchMap(() => {
    router.replace("/")
    return empty()
  })
)

export const authEpics = combineEpics(loginSubmitEpic, signupSubmitEpic, authSuccessEpic)
