export interface RssFeedReaction {
  viewed?: boolean
  readed?: boolean
  read_later?: boolean
  liked?: boolean
  disliked?: boolean
  archived?: boolean
}

export interface Readable {
  url?: string
  domain?: string
  title?: string
  content?: string
  date_published?: string
  lead_image_url?: string
  dek?: string
  excerpt?: string
  word_count?: number
  direction?: string
  total_pages?: number
  rendered_pages?: number
  next_page_url?: string
}

export interface Rss {
  id: string
  title?: string
  content?: string
  summary?: string
  author?: string
  published?: string
  updated?: string
  alternate?: string
  keywords: string[]
  enclosure?: string
  fingerprint?: string
}

export interface RssFeed {
  uuid: string
  rss_url: string
  rss?: Rss
  readable?: Readable
  created: string
  updated: string
  rss_source_uuid: string
}

export interface UserRssFeed {
  uuid: string
  user_uuid: string
  feed_uuid: string
  viewed: boolean,
  readed: boolean,
  read_later: boolean,
  liked: boolean,
  disliked: boolean,
  archived: boolean,
  created: string
  updated: string
}

export function getTitle({ readable, rss }: RssFeed): string | undefined {
  if (!!readable && !!readable.title) {
    return readable.title
  } else if (rss) {
    return rss.title
  } else {
    return undefined
  }
}

export function getExcerpt({ readable, rss }: RssFeed): string | undefined {
  if (readable) {
    return readable.excerpt
  } else if (rss) {
    return rss.summary
  } else {
    return undefined
  }
}

export function isImageAlreadyShow({ readable }: RssFeed): string | undefined {
  if (readable && readable.lead_image_url && readable.content && readable.content.indexOf(readable.lead_image_url) !== -1) {
    return readable.lead_image_url
  } else {
    return undefined
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
  } else {
    return undefined
  }
}
