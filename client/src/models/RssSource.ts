import { object, string, array, optional } from "validation.ts"

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

export type RssSource = typeof RssSourceValidator.T
