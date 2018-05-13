import { Epic, combineEpics } from "redux-observable"
import { isActionOf } from "typesafe-actions"
import { empty } from "rxjs"
import { filter, switchMap } from "rxjs/operators"

import { AppActions } from "../app/AppActions"
import { GlobalState, Dependencies } from "app/AppState"
import { Actions } from "Actions"
import * as router from "router"

type EpicType = Epic<Actions, GlobalState, Dependencies>

const logoutEpic: EpicType = action$ => action$.pipe(
    filter(isActionOf(AppActions.logout)),
    switchMap(() => {
        router.replace("/login")
        return empty()
    })
)

export const appEpics = combineEpics(logoutEpic)
