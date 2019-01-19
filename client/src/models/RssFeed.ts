import { object, string, number, array, union } from "validation.ts"
import { optional } from "~/models/optional"

export const ReactionValidator = union("Unreaded", "Readed", "ReadLater", "Viewed", "Liked", "Disliked", "Archived")
export type Reaction = typeof ReactionValidator.T

export const ReadableValidator = object({
  url: optional(string),
  domain: optional(string),
  title: optional(string),
  content: optional(string),
  date_published: optional(string),
  lead_image_url: optional(string),
  dek: optional(string),
  excerpt: optional(string),
  word_count: optional(number),
  direction: optional(string),
  total_pages: optional(number),
  rendered_pages: optional(number),
  next_page_url: optional(string),
})
export type Readable = typeof ReadableValidator.T

export const RssValidator = object({
  id:          string,
  title:       optional(string),
  content:     optional(string),
  summary:     optional(string),
  author:      optional(string),
  published:   optional(string),
  updated:     optional(string),
  alternate:   optional(string),
  keywords:    array(string),
  enclosure:   optional(string),
  fingerprint: optional(string),
})
export type Rss = typeof RssValidator.T

export const RssFeedValidator = object({
  uuid: string,
  rss_url: string,
  rss: optional(RssValidator),
  readable: optional(ReadableValidator),
  created: string,
  updated: string,
  rss_source_uuid: string,
})
export type RssFeed = typeof RssFeedValidator.T

export const UserRssFeedValidator = object({
  uuid: string,
  user_uuid: string,
  feed_uuid: string,
  reaction: ReactionValidator,
  created: string,
  updated: string,
})
export type UserRssFeed = typeof UserRssFeedValidator.T

export function getTitle({ readable, rss }: RssFeed): string | undefined {
  if (readable) {
    return readable.title
  } else if (rss) {
    return rss.title
  }
}

export function getExcerpt({ readable, rss }: RssFeed): string | undefined {
  if (readable) {
    return readable.excerpt
  } else if (rss) {
    return rss.summary
  }
}

export function isImageAlreadyShow({ readable }: RssFeed): string | undefined {
  if (readable && readable.lead_image_url && readable.content && readable.content.indexOf(readable.lead_image_url) !== -1) {
    return readable.lead_image_url
  }
}

export function getRssContent(rss: Rss): string | undefined {
  const { content, summary } = rss
  if (content && !summary) {
    return content
  } else if (summary && !content) {
    return summary
  } else if (content && summary) {
    return content.length > summary.length ? content : summary
  }
}
