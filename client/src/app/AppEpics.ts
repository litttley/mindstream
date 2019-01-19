import { combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { EMPTY } from "rxjs"
import { filter, switchMap } from "rxjs/operators"

import { AppActions } from "~/app/AppActions"
import * as router from "~/router"
import { EpicType } from "~/RootEpic"

const logoutEpic: EpicType = action$ => action$.pipe(
  filter(isActionOf(AppActions.logout)),
  switchMap(() => {
    router.replace("/login")
    return EMPTY
  })
)

export const appEpics = combineEpics(logoutEpic)
