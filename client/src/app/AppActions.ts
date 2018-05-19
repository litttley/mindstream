import { createAction, ActionType } from "typesafe-actions"

export const AppActions = {
  menuToggle: createAction("MenuToggle", resolve => (isMenuOpen: boolean) => resolve({ isMenuOpen })),
  logout: createAction("Logout"),
}

export type AppAction = ActionType<typeof AppActions>
