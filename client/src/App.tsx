import * as React from "react"

import { Route, Switch } from "react-router"
import { Provider } from "react-redux"
import { ConnectedRouter } from "connected-react-router"
import { PersistGate } from "redux-persist/integration/react"
import { history } from "router"
import { IntlProvider } from "react-intl"

import { store, persistor } from "Store"
import { AppActions } from "app/AppActions"
import messages from "messages"
import LoginContainer from "auth/LoginContainer"
import SignupContainer from "auth/SignupContainer"
import FeedsScreen from "feeds/FeedsScreen"
import MindstreamContainer from "mindstream/MindstreamContainer"
import RssSourcesPage from "rssSources/RssSourcesPage"
import FeedScreen from "feed/FeedScreen"

export default class App extends React.PureComponent {
  render() {
    return (
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor} onBeforeLift={() => {
          store.dispatch(AppActions.start())
        }}>
          <IntlProvider locale="en" messages={messages}>
            <ConnectedRouter history={history}>
              <Switch>
                <Route exact path="/" component={MindstreamContainer}/>
                <Route exact path="/feed/:uuid" component={FeedScreen} />
                <Route exact path="/feeds" component={FeedsScreen}/>
                <Route exact path="/stream/:sourceUuid" component={MindstreamContainer}/>
                <Route exact path="/sources" component={RssSourcesPage}/>
                <Route exact path="/login" component={LoginContainer}/>
                <Route exact path="/signup" component={SignupContainer}/>
              </Switch>
            </ConnectedRouter>
          </IntlProvider>
        </PersistGate>
      </Provider>
    )
  }
}
