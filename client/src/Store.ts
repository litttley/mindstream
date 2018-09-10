import { createStore, combineReducers, applyMiddleware } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { createEpicMiddleware } from "redux-observable"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { connectRouter, routerMiddleware } from "connected-react-router"
import { StateType } from "typesafe-actions"
import { history } from "router"

import AppReducer from "app/AppReducer"
import FeedsReducer from "feeds/FeedsReducer"
import MindStreamReducer from "mindstream/MindStreamReducer"
import SourcesReducer from "rssSources/SourcesReducer"

import RootEpic from "RootEpic"
import { createApiInstance, Requests } from "services/Api"
import AuthReducer from "auth/AuthReducer"

const persistConfig = {
  key: "root_mindstream",
  storage,
  blacklist: ["auth", "feeds", "mindStream", "sources"]
}

export interface Dependencies {
  api: Requests
}

const dependencies: Dependencies = {
  api: createApiInstance()
}

const rootReducer = combineReducers({
  app: AppReducer,
  auth: AuthReducer,
  feeds: FeedsReducer,
  mindStream: MindStreamReducer,
  sources: SourcesReducer,
})

export type GlobalState = StateType<typeof rootReducer>

const epicMiddleware = createEpicMiddleware({ dependencies })

const routedReducer = connectRouter(history)(rootReducer)
const persistedReducer = persistReducer(persistConfig, routedReducer)

const enhancer = composeWithDevTools(
  applyMiddleware(routerMiddleware(history)),
  applyMiddleware(epicMiddleware),
)

export const store = createStore(persistedReducer, enhancer)
export const persistor = persistStore(store)

// tslint:disable-next-line:no-any
epicMiddleware.run(RootEpic as any)
