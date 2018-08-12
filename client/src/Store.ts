import { createStore, combineReducers, applyMiddleware, Reducer } from "redux"
import { composeWithDevTools } from "redux-devtools-extension"
import { createEpicMiddleware } from "redux-observable"
import { persistStore, persistReducer } from "redux-persist"
import storage from "redux-persist/lib/storage"
import { routerReducer, routerMiddleware } from "react-router-redux"
import { history } from "router"

import AppReducer from "app/AppReducer"
import FeedsReducer from "feeds/FeedsReducer"
import MindStreamReducer from "mindstream/MindStreamReducer"
import SourcesReducer from "rssSources/SourcesReducer"

import RootEpic from "RootEpic"
import { Dependencies, GlobalState } from "app/AppState"
import { createApiInstance } from "services/Api"
import AuthReducer from "auth/AuthReducer"

const persistConfig = {
  key: "root_mindstream",
  storage,
  blacklist: ["auth", "feeds", "mindStream", "sources"]
}

const dependencies: Dependencies = {
  api: createApiInstance()
}

const middleware = routerMiddleware(history)

const reducers = combineReducers<GlobalState>({
  app: AppReducer,
  auth: AuthReducer,
  feeds: FeedsReducer,
  mindStream: MindStreamReducer,
  sources: SourcesReducer,
  router: routerReducer
})

const epicMiddleware = createEpicMiddleware({ dependencies })

const persistedReducer: Reducer<GlobalState> = persistReducer(persistConfig, reducers)

const enhancer = composeWithDevTools(
  applyMiddleware(middleware),
  applyMiddleware(epicMiddleware),
)
export const store = createStore(persistedReducer, enhancer)
export const persistor = persistStore(store)

// tslint:disable-next-line:no-any
epicMiddleware.run(RootEpic as any)
