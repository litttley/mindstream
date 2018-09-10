import { object } from "validation.ts"
import { RssFeedValidator, UserRssFeedValidator } from "models/RssFeed"

export const RssFeedsResponseValidator = object({
  rss_feed: RssFeedValidator,
  user_rss_feed: UserRssFeedValidator,
})

export type RssFeedsResponse = typeof RssFeedsResponseValidator.T
