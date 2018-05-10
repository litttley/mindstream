import "es6-promise/auto"
import "es6-shim"
import "normalize.css"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Route, Switch } from "react-router"
import { Provider } from "react-redux"
import { ConnectedRouter } from "react-router-redux"
import { PersistGate } from "redux-persist/integration/react"
import { history } from "router"

import LoginContainer from "./login/LoginContainer"
import SignupContainer from "./signup/SignupContainer"
import FeedsContainer from "./feeds/FeedsContainer"
import MindStreamContainer from "./mindstream/MindStreamContainer"
import SourcesContainer from "./sources/SourcesContainer"
import { store, persistor } from "Store"

ReactDOM.render(
    <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
            <ConnectedRouter history={history}>
                <Switch>
                    <Route exact path="/" component={MindStreamContainer}/>
                    <Route exact path="/stream/:sourceUuid" component={MindStreamContainer}/>
                    <Route exact path="/feeds" component={FeedsContainer}/>
                    <Route exact path="/sources" component={SourcesContainer}/>
                    <Route exact path="/login" component={LoginContainer}/>
                    <Route exact path="/signup" component={SignupContainer}/>
                </Switch>
            </ConnectedRouter>
        </PersistGate>
    </Provider>,
    document.getElementById("app")
)
