import * as React from "react"
import { Route, Switch, HashRouter } from "react-router-dom"
import LoginScreen from "~/auth/LoginScreen"
import SignupScreen from "~/auth/SignupScreen"
import LikedRssFeedsScreen from "~/rssFeeds/LikedRssFeedsScreen"
import UnreadedRssFeedsScreen from "./rssFeeds/UnreadedRssFeedsScreen"
import RssSourcesScreen from "~/rssSources/RssSourcesScreen"
import RssFeedScreen from "~/rssFeeds/RssFeedScreen"
import { IntlContext, intlContextInitialValues } from "~/intl/IntlContext"
import { AppProvider } from "./app/AppState"
import { RssSourcesProvider } from "./rssSources/RssSourcesState"
import { RssFeedsProvider } from "./rssFeeds/RssFeedsState"
import { AuthProvider } from "./auth/AuthState"
import UnreadedRssFeedsByRssSourceScreen from "./rssFeeds/UnreadedRssFeedsByRssSourceScreen"

export default class App extends React.PureComponent {
  render() {
    return (
      <IntlContext.Provider value={intlContextInitialValues}>
        <AuthProvider>
          <AppProvider>
            <RssSourcesProvider>
              <RssFeedsProvider>
                <HashRouter>
                  <Switch>
                    <Route exact path="/" component={UnreadedRssFeedsScreen}/>
                    <Route exact path="/rss/feeds/liked" component={LikedRssFeedsScreen}/>
                    <Route exact path="/rss/feeds/:rssSourceUuid" component={UnreadedRssFeedsByRssSourceScreen} />
                    <Route exact path="/rss/feed/:rssFeedUuid" component={RssFeedScreen} />
                    <Route exact path="/rss/sources" component={RssSourcesScreen}/>
                    <Route exact path="/login" component={LoginScreen}/>
                    <Route exact path="/signup" component={SignupScreen}/>
                  </Switch>
                </HashRouter>
              </RssFeedsProvider>
            </RssSourcesProvider>
          </AppProvider>
        </AuthProvider>
      </IntlContext.Provider>
    )
  }
}
