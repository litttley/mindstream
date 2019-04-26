import * as React from "react"
import { createPersistedStore } from "~/Store"

export interface AppState {
  isMenuOpen: boolean
}

const initState: AppState = {
  isMenuOpen: false,
}

export const [AppContext, AppProvider] = createPersistedStore(initState, "APP_STATE", localStorage)

export function useMenuToggle() {
  const { update, ...state } = React.useContext(AppContext)

  return {
    ...state,
    menuToggle: () => update({ isMenuOpen: !state.isMenuOpen }),
  }
}
