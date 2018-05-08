import { object, string, number, array, optional } from "validation.ts"

export type Reaction = "Readed" | "ReadLater" | "Viewed" | "Liked" | "Disliked" | "Archived"

export const ReadableValidator = object({
    url: string,
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

export const RssValidator = object({
    id:          string,
    title:       optional(string),
    content:     optional(string),
    summary:     optional(string),
    author:      optional(string),
    published:   string,
    updated:     optional(string),
    alternate:   optional(string),
    keywords:    array(string),
    enclosure:   optional(string),
    fingerprint: string,
})

export const RssFeedValidator = object({
    uuid: string,
    url: string,
    rss: optional(RssValidator),
    readable: optional(ReadableValidator),
    created: string,
    updated: string,
    rss_source_uuid: string,
})

export type RssFeed = typeof RssFeedValidator.T
export type Readable = typeof ReadableValidator.T
export type Rss = typeof RssValidator.T
