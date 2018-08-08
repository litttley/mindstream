import { getType } from "typesafe-actions"
import { AppActions } from "app/AppActions"
import { Actions } from "Actions"

export interface AppState {
    isMenuOpen: boolean
}

const initState: AppState = {
    isMenuOpen: false,
}

const AppReducer = (state: AppState = initState, action: Actions) => {
    switch (action.type) {
        case getType(AppActions.menuToggle): return { ...state, isMenuOpen: !state.isMenuOpen }
        default: return state
    }
}

export default AppReducer
