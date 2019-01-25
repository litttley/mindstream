import * as React from "react"
import * as styles from "./RssSourceCard.css"
import { RssSource, getRssSourceIconUrl } from "~/models/RssSource"
import GhostdButton from "~/components/buttons/GhostButton"

interface Props {
  rssSource: RssSource
  followRssSource: (rssSource: RssSource) => void
}

export default function RssSourceCard({ rssSource, followRssSource }: Props) {
  const { uuid, url, title, description } = rssSource
  const icon = getRssSourceIconUrl(rssSource)

  const Description = description ? <p className={styles.description}>{description}</p> : undefined

  return (
    <div className={styles.rssSourceCard}>
      <div className={styles.icon}>
        {icon
          ? <img src={icon} width="100%" />
          : <div className={styles.noIcon} />
        }
      </div>
      <div className={styles.infos}>
        <a className={styles.title} href={`#/stream/${uuid}`}>{title}</a>
        <a className={styles.url} href={url}>{url}</a>
        {Description}
        <div className={styles.actions}>
          <GhostdButton label="Follow" onClick={() => followRssSource(rssSource)} />
        </div>
      </div>
    </div>
  )
}
