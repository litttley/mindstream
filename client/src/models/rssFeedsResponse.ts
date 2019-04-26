import { RssFeed, UserRssFeed } from "~/models/rssFeed"

export interface RssFeedsResponse {
  rss_feed: RssFeed
  user_rss_feed: UserRssFeed
}
