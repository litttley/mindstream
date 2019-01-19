import { object, string, array, number, optional } from "validation.ts"

export const RssSourceValidator = object({
  uuid: string,
  url: string,
  title: string,
  website: string,
  description: optional(string),
  language: optional(string),
  icon_url: optional(string),
  cover_url: optional(string),
  visual_url: optional(string),
  topics: optional(array(string)),
  last_updated: optional(string),
  error: optional(string),
  created: string,
  updated: string,
})

export const MyRssSourceValidator = object({
  rss_source: RssSourceValidator,
  unreaded: number
})

export type RssSource = typeof RssSourceValidator.T
export type MyRssSource = typeof MyRssSourceValidator.T

export function getRssSourceIconUrl({ visual_url, icon_url, cover_url }: RssSource): string | undefined {
  if (visual_url) {
    return visual_url
  } else if (icon_url) {
    return icon_url
  } else if (cover_url) {
    return cover_url
  }
}
