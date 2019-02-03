import * as React from "react"
import * as styles from "./RssFeedCard.css"

import { RssFeed, getTitle, getRssContent } from "~/models/RssFeed"
import StarIcon from "~/components/icons/StarIcon"
import { RssFeedsResponse } from "~/models/RssFeedsResponse"
import Tabs from "~/components/tabs/Tabs"
import Tab from "~/components/tabs/Tab"
import IconButton from "~/components/buttons/IconButton"
import { useIntlMessage } from "~/hooks/useIntlMessage"

interface Props {
  feed: RssFeedsResponse
  likedLoading: boolean
  onLike: (feed: RssFeed) => void
  onUnlike: (feed: RssFeed) => void
}

type TabName = "rss" | "readable"

function CardTab({ label, name, content }: { label: string, name: TabName, content: string }) {
  return (
    <Tab label={label} name={name}>
      <div dangerouslySetInnerHTML={{ __html: sanitize(content) }} />
    </Tab>
  )
}

export default function RssFeedCard({ feed, likedLoading, onLike, onUnlike }: Props) {
  const [selectedTab, setSelectedTab] = React.useState<TabName>(feed.rss_feed.readable ? "readable" : "rss")
  const message = useIntlMessage()
  const { readable } = feed.rss_feed
  const { rss } = feed.rss_feed
  const ReadableTab = !!readable && !!readable.content ? <CardTab label="Readable" name="readable" content={readable.content} /> : undefined

  React.useEffect(() => {
    window.scrollTo(0, 0)
  }, [feed.rss_feed.uuid])

  const RssTab = () => {
    if (rss) {
      const rssContent = getRssContent(rss)
      return <CardTab label="Rss" name="rss" content={rssContent || ""} />
    } else {
      return undefined
    }
  }

  const onLikeUnlike = feed.user_rss_feed.reaction === "Liked" ? onUnlike : onLike

  return (
    <div className={styles.feedCard}>
      <div className={styles.head}>
        <h1 className={styles.title}>{getTitle(feed.rss_feed) || message("noTitle")}</h1>
        <a className={styles.url} target="_blanc" href={feed.rss_feed.rss_url}>{feed.rss_feed.rss_url}</a>
        <div className={styles.dates}>
          <div className={styles.date}>
            {"Date" /* TODO */}
          </div>
          <IconButton loading={likedLoading} onClick={() => onLikeUnlike(feed.rss_feed)}>
            <StarIcon color={feed.user_rss_feed.reaction === "Liked" ? "#73ff00" : "#000000"} />
          </IconButton>
        </div>
      </div>
      <div className={styles.feedContent}>
        <Tabs selectedTabName={selectedTab} onChange={tab => setSelectedTab(tab as TabName)}>
          {ReadableTab}
          {RssTab()}
        </Tabs>
      </div>
    </div>
  )
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
  while (i) {
    i -= 1
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
