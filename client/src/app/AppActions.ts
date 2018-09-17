import { createStandardAction, ActionType } from "typesafe-actions"

export const AppActions = {
  start: createStandardAction("Start")(),
  menuToggle: createStandardAction("MenuToggle")(),
  logout: createStandardAction("Logout")(),
}

export type AppAction = ActionType<typeof AppActions>
