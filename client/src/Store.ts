import { createStore, combineReducers, applyMiddleware, Reducer } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { createEpicMiddleware } from "redux-observable"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { routerReducer, routerMiddleware } from "react-router-redux"
import { history } from "router"

import AppReducer from "app/AppReducer"
import LoginReducer from "login/LoginReducer"
import SignupReducer from "signup/SignupReducer"
import FeedsReducer from "feeds/FeedsReducer"
import MindStreamReducer from "mindstream/MindStreamReducer"
import SourcesReducer from "sources/SourcesReducer"

import RootEpic from "RootEpic"
import { Dependencies, GlobalState } from "app/AppState"
import { createApiInstance } from "services/Api"

const persistConfig = {
    key: "root_mindstream",
    storage,
    blacklist: ["login", "signup", "feeds", "mindStream", "sources"]
}

const dependencies: Dependencies = {
    api: createApiInstance()
}

const epicMiddleware = createEpicMiddleware(RootEpic, { dependencies })
const middleware = routerMiddleware(history)

const reducers = combineReducers<GlobalState>({
    app: AppReducer,
    login: LoginReducer,
    signup: SignupReducer,
    feeds: FeedsReducer,
    mindStream: MindStreamReducer,
    sources: SourcesReducer,
    router: routerReducer
})

const persistedReducer: Reducer<GlobalState> = persistReducer(persistConfig, reducers)

const enhancer = composeWithDevTools(
    applyMiddleware(middleware),
    applyMiddleware(epicMiddleware),
)
export const store = createStore(persistedReducer, enhancer)
export const persistor = persistStore(store)