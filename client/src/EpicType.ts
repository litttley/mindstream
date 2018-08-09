import { Epic } from "redux-observable"
import { Actions } from "Actions"
import { GlobalState, Dependencies } from "app/AppState"

export type EpicType = Epic<Actions, Actions, GlobalState, Dependencies>
