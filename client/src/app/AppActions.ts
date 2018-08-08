import { createStandardAction, ActionType } from "typesafe-actions"

export const AppActions = {
  menuToggle: createStandardAction("MenuToggle")(),
  logout: createStandardAction("Logout")(),
}

export type AppAction = ActionType<typeof AppActions>
