import "es6-promise/auto"
import "es6-shim"
import "reset.css"
import "colors.css"
import * as React from "react"
import * as ReactDOM from "react-dom"
import { Route, Switch } from "react-router"
import { Provider } from "react-redux"
import { ConnectedRouter } from "react-router-redux"
import { PersistGate } from "redux-persist/integration/react"
import { history } from "router"
import { IntlProvider } from "react-intl"

import LoginContainer from "auth/LoginContainer"
import SignupContainer from "auth/SignupContainer"
import FeedsContainer from "./feeds/FeedsContainer"
import MindStreamContainer from "./mindstream/MindStreamContainer"
import RssSourcesPage from "rssSources/RssSourcesPage"
import { store, persistor } from "Store"

import messages from "messages"

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <IntlProvider locale="en" messages={messages}>
        <ConnectedRouter history={history}>
          <Switch>
            <Route exact path="/" component={MindStreamContainer}/>
            <Route exact path="/stream/:sourceUuid" component={MindStreamContainer}/>
            <Route exact path="/feeds" component={FeedsContainer}/>
            <Route exact path="/sources" component={RssSourcesPage}/>
            <Route exact path="/login" component={LoginContainer}/>
            <Route exact path="/signup" component={SignupContainer}/>
          </Switch>
        </ConnectedRouter>
      </IntlProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("app")
)
