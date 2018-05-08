import { buildAction, ActionsUnion } from "typesafe-actions"

export const AppActions = {
  menuToggle: buildAction("MenuToggle").payload<{ isMenuOpen: boolean }>(),
}

export type AppAction = ActionsUnion<typeof AppActions>
