import { buildAction, ActionsUnion } from "typesafe-actions"

export const AppActions = {
  menuToggle: buildAction("MenuToggle").payload<{ isMenuOpen: boolean }>(),
  logout: buildAction("Logout").empty(),
}

export type AppAction = ActionsUnion<typeof AppActions>
