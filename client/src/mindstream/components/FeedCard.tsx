import * as React from "react"
import * as styles from "./FeedCard.css"
import { InjectedIntlProps, injectIntl } from "react-intl"

import { RssFeed, getTitle, getRssContent } from "~/models/RssFeed"
import StarIcon from "~/components/icons/StarIcon"
import { RssFeedsResponse } from "~/services/RssFeedsResponse"
import Tabs from "~/components/tabs/Tabs"
import Tab from "~/components/tabs/Tab"
import IconButton from "~/components/buttons/IconButton"

interface Props {
  feed: RssFeedsResponse
  likedLoading: boolean
  onLike: (feed: RssFeed) => void
}

type TabName = "rss" | "readable"

interface State {
  selectedTab: TabName
}

class FeedCard extends React.PureComponent<Props & InjectedIntlProps, State> {
  constructor(props: Props & InjectedIntlProps) {
    super(props)
    this.state = {
      selectedTab: !!this.props.feed.rss_feed.readable ? "readable" : "rss"
    }
  }

  render() {
    const { feed, intl, likedLoading } = this.props
    return (
      <div className={styles.feedCard}>
        <div className={styles.head}>
          <h1 className={styles.title}>{getTitle(feed.rss_feed) || intl.formatMessage({ id: "noTitle" })}</h1>
          <a className={styles.url} target="_blanc" href={feed.rss_feed.rss_url}>{feed.rss_feed.rss_url}</a>
          <div className={styles.dates}>
            <div className={styles.date}>
              {intl.formatRelative((!!feed.rss_feed.rss && !!feed.rss_feed.rss.published) ? feed.rss_feed.rss.published : feed.rss_feed.created)}
            </div>
            <IconButton loading={likedLoading} onClick={this.handleOnReaction}>
              <StarIcon color={feed.user_rss_feed.reaction === "Liked" ? "#73ff00" : "#000000"} />
            </IconButton>
          </div>
        </div>
        <div className={styles.feedContent}>
          <Tabs selectedTabName={this.state.selectedTab} onChange={this.handleTabChange}>
            {this.renderReadableTab()}
            {this.renderRssTab()}
          </Tabs>
        </div>
      </div>
    )
  }

  renderReadableTab = () => {
    const { readable } = this.props.feed.rss_feed
    if (!!readable && !!readable.content) {
      return (
        <Tab label="Readable" name="readable">
          <div dangerouslySetInnerHTML={{ __html: sanitize(readable.content) }} />
        </Tab>
      )
    }
  }

  renderRssTab = () => {
    const { rss } = this.props.feed.rss_feed
    if (!!rss && !!getRssContent(rss)) {
      return (
        <Tab label="Rss" name="rss">
          {getRssContent(rss)}
        </Tab>
      )
    }
  }

  handleTabChange = (selectedTab: TabName) => {
    this.setState({ selectedTab })
  }

  handleOnReaction = () => this.props.onLike(this.props.feed.rss_feed)
}

function sanitize(content: string): string {
  return stripScriptsWithRegex(sanitizeWithDom(content, html => sanitizeResponsiveImages(sanitizeScripts(html))))
}

function stripScriptsWithRegex(html: string): string {
  const regex = `<script(?:(?!\/\/)(?!\/\*)[^'"]|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\/\/.*(?:\n)|\/\*(?:(?:.|\s))*?\*\/)*?<\/script>`
  return html.replace(regex, regex)
}

function sanitizeWithDom(content: string, f: (html: HTMLDivElement) => HTMLDivElement): string {
  const div = document.createElement("div")
  div.innerHTML = content
  return f(div).innerHTML
}

function sanitizeScripts(html: HTMLDivElement): HTMLDivElement {
  const scripts = html.getElementsByTagName("script")
  let i = scripts.length
  while (i--) {
    const script = scripts[i]
    if (script.parentNode) {
      script.parentNode.removeChild(script)
    }
  }
  return html
}

function sanitizeResponsiveImages(html: HTMLDivElement): HTMLDivElement {
  // TODO find better solution
  html.querySelectorAll("picture").forEach(p => {
    const source = p.querySelector("source")
    if (source) {
      source.remove()
    }
  })

  return html
}

export default injectIntl(FeedCard)
