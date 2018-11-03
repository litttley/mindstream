import { combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { empty } from "rxjs"
import { filter, switchMap } from "rxjs/operators"

import { AppActions } from "~/app/AppActions"
import * as router from "~/router"
import { EpicType } from "~/RootEpic"

const logoutEpic: EpicType = action$ => action$.pipe(
  filter(isActionOf(AppActions.logout)),
  switchMap(() => {
    router.replace("/login")
    return empty()
  })
)

export const appEpics = combineEpics(logoutEpic)
