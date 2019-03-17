import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { RssSource, getRssSourceIconUrl } from "~/models/rssSource"
import { GhostdButton } from "~/components/buttons/GhostButton"
import { colors } from "~/guideStyles"

interface Props {
  isFollowed: boolean
  rssSource: RssSource
  followRssSource: (rssSource: RssSource) => void
  unfollowRssSource: (rssSource: RssSource) => void
}

export function RssSourceCard({ rssSource, isFollowed, followRssSource, unfollowRssSource }: Props) {
  const { uuid, url, title, description } = rssSource
  const icon = getRssSourceIconUrl(rssSource)

  const Description = description ? <p className={css(styles.description)}>{description}</p> : undefined

  return (
    <div className={css(styles.rssSourceCard)}>
      <div className={css(styles.icon)}>
        {icon
          ? <img src={icon} width="100%" />
          : <div className={css(styles.noIcon)} />
        }
      </div>
      <div className={css(styles.infos)}>
        <a className={css(styles.title)} href={`#/stream/${uuid}`}>{title}</a>
        <a className={css(styles.url)} href={url}>{url}</a>
        {Description}
        <div className={css(styles.actions)}>
          {!isFollowed
            ? <GhostdButton label="Follow" onClick={() => followRssSource(rssSource)} />
            : <GhostdButton label="Unfollow" onClick={() => unfollowRssSource(rssSource)} />
          }
        </div>
      </div>
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  rssSourceCard: {
    display: "flex",
    flexDirection: "row",
    padding: 15,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.secondary,
    marginBottom: 20,
  },
  icon: {
    width: 60,
    height: 60,
  },
  noIcon: {
    width: 60,
    height: 60,
    backgroundColor: colors.secondary,
  },
  infos: {
    flex: 1,
    marginLeft: 20,
  },
  title: {
    display: "block",
    fontSize: "1.4rem",
    color: colors.primary,
    textDecoration: "none",
    marginBottom: 5,
  },
  url: {
    display: "block",
    fontSize: ".9rem",
    color: colors.primary,
    textDecoration: "none",
    marginBottom: 5,
  },
  description: {
    fontSize: "1rem",
    marginBottom: 5,
  },
  actions: {
    marginTop: 15,
    width: 300,
  },
})
