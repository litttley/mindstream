import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { RssFeed, getTitle, getRssContent } from "~/models/rssFeed"
import { StarIcon } from "~/components/icons/StarIcon"
import { RssFeedsResponse } from "~/models/rssFeedsResponse"
import { Tabs } from "~/components/tabs/Tabs"
import { Tab } from "~/components/tabs/Tab"
import { IconButton } from "~/components/buttons/IconButton"
import { useIntlMessage } from "~/hooks/useIntlMessage"

interface Props {
  feed: RssFeedsResponse
  likedLoading: boolean
  onLike: (feed: RssFeed) => void
  onUnlike: (feed: RssFeed) => void
}

type TabName = "rss" | "readable"

interface CardTabProps {
  label: string
  name: TabName
  content: string
}

function CardTab({ label, name, content }: CardTabProps) {
  return (
    <Tab label={label} name={name}>
      <div dangerouslySetInnerHTML={{ __html: sanitize(content) }} />
    </Tab>
  )
}

export function RssFeedCard({ feed, likedLoading, onLike, onUnlike }: Props) {
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

  const onLikeUnlike = feed.user_rss_feed.liked ? onUnlike : onLike

  return (
    <div className={css(styles.feedCard)}>
      <div className={css(styles.head)}>
        <h1 className={css(styles.title)}>{getTitle(feed.rss_feed) || message("noTitle")}</h1>
        <a className={css(styles.url)} target="_blanc" href={feed.rss_feed.rss_url}>{feed.rss_feed.rss_url}</a>
        <div className={css(styles.dates)}>
          <div className={css(styles.date)}>
            {"Date" /* TODO */}
          </div>
          <IconButton loading={likedLoading} onClick={() => onLikeUnlike(feed.rss_feed)}>
            <StarIcon color={feed.user_rss_feed.liked ? "#73ff00" : "#000000"} />
          </IconButton>
        </div>
      </div>
      <div className="feedContent">
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

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  feedCard: {
    width: "100%",
    hyphens: "auto",
    overflow: "hidden",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "20px 20px 100px 20px",
    "@media screen and (min-width: 980px)": {
      maxWidth: 900,
      alignSelf: "center",
      padding: "40px 20px 50px 20px",
      margin: "auto",
    },
  },
  title: {
    fontSize: "1.5rem",
    "@media screen and (min-width: 480px)": {
      fontSize: "1.9rem",
    },
  },
  url: {
    display: "block",
    fontSize: "0.9rem",
    padding: "5px 0",
    margin: "5px 0",
    textDecoration: "none",
    color: "#999999",
    ":hover": {
      color: "#777777",
    },
  },
  dates: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date: {
    fontSize: "0.9rem",
    color: "#777777",
  },
  head: {
    paddingBottom: 5,
  },
})
