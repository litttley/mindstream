import { RssFeed, UserRssFeed } from "~/models/RssFeed"

export interface RssFeedsResponse {
  rss_feed: RssFeed
  user_rss_feed: UserRssFeed
}
