import * as React from "react"
import * as styles from "./FeedExcerpt.css"
import { RssFeedsResponse } from "~/services/RssFeedsResponse"
import { getTitle, getExcerpt } from "~/models/RssFeed"
import classNames from "~/utils/classNames"

interface Props {
  feed: RssFeedsResponse
  onClick: (feed: RssFeedsResponse) => void
  className?: string
}

export default class FeedExcerpt extends React.PureComponent<Props> {
  render() {
    const { feed, className } = this.props
    const { rss_feed } = feed
    const { readable } = rss_feed
    const classes = classNames({
      [styles.feedExcerpt]: true,
      [className || ""]: !!className,
    })
    return (
      <div role="button" onClick={this.handleOnClick} className={classes}>
        <div className={styles.imageContainer}>
          {readable ? <img className={styles.image} src={readable.lead_image_url} /> : <div className={styles.noImage} />}
        </div>
        <div className={styles.content}>
          <h1 className={styles.title}>
            {getTitle(rss_feed)}
          </h1>
          <p className={styles.excerpt}>
            {getExcerpt(rss_feed)}
          </p>
        </div>
      </div>
    )
  }

  handleOnClick = () => this.props.onClick(this.props.feed)
}
