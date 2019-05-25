import * as React from "react"
import { Route, Switch, HashRouter } from "react-router-dom"
import CssBaseline from "@material-ui/core/CssBaseline"

import { LoginScreen } from "~/auth/LoginScreen"
import { SignupScreen } from "~/auth/SignupScreen"
import { LikedRssFeedsScreen } from "~/rssFeeds/LikedRssFeedsScreen"
import { UnreadedRssFeedsScreen } from "./rssFeeds/UnreadedRssFeedsScreen"
import { RssSourcesScreen } from "~/rssSources/RssSourcesScreen"
import { RssFeedScreen } from "~/rssFeeds/RssFeedScreen"
import { IntlContext, intlContextInitialValues } from "~/intl/intlContext"
import { AppProvider } from "~/states/AppState"
import { RssSourcesProvider } from "./rssSources/RssSourcesState"
import { RssFeedsProvider } from "./rssFeeds/RssFeedsState"
import { AuthProvider } from "./auth/AuthState"
import { UnreadedRssFeedsByRssSourceScreen } from "~/rssFeeds/UnreadedRssFeedsByRssSourceScreen"
import { Home } from "./rssFeeds/Home"

export function App() {
  return (
    <IntlContext.Provider value={intlContextInitialValues}>
      <CssBaseline />
      <AuthProvider>
        <AppProvider>
          <RssSourcesProvider>
            <RssFeedsProvider>
              <HashRouter>
                <Switch>
                  <Route exact path="/" component={UnreadedRssFeedsScreen} />
                  <Route exact path="/rss/feeds/liked" component={LikedRssFeedsScreen} />
                  <Route exact path="/v2" component={Home}/>
                  <Route exact path="/rss/feeds/:rssSourceUuid" component={UnreadedRssFeedsByRssSourceScreen} />
                  <Route exact path="/rss/feed/:rssFeedUuid" component={RssFeedScreen} />
                  <Route exact path="/rss/sources" component={RssSourcesScreen} />
                  <Route exact path="/login" component={LoginScreen} />
                  <Route exact path="/signup" component={SignupScreen} />
                </Switch>
              </HashRouter>
            </RssFeedsProvider>
          </RssSourcesProvider>
        </AppProvider>
      </AuthProvider>
    </IntlContext.Provider>
  )
}
