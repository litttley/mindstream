export interface RssSource {
  uuid: string
  url: string
  title: string
  website: string
  description?: string
  language?: string
  icon_url?: string
  cover_url?: string
  visual_url?: string
  topics?: string[]
  last_updated?: string
  error?: string
  created: string
  updated: string
}

export interface MyRssSource {
  rss_source: RssSource
  unreaded: number
}

export function getRssSourceIconUrl({ visual_url, icon_url, cover_url }: RssSource): string | undefined {
  if (visual_url) {
    return visual_url
  } else if (icon_url) {
    return icon_url
  } else if (cover_url) {
    return cover_url
  } else {
    return undefined
  }
}
