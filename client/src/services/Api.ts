import Axios, { AxiosInstance,  AxiosRequestConfig } from "axios"
import * as router from "~/router"
import { RssFeed, Reaction, UserRssFeed } from "~/models/RssFeed"
import { RssSource, MyRssSource } from "~/models/RssSource"
import { AuthResponse } from "~/models/AuthResponse"
import { Login } from "~/models/Login"
import { Signup } from "~/models/Signup"
import { RssFeedsResponse } from "~/models/RssFeedsResponse"

const STORAGE_AUTH_TOKEN_KEY = "AUTH_TOKEN"

export class ApiService {
  private readonly instance: AxiosInstance
  private token?: string
  public constructor(baseURL?: string) {
    this.instance = Axios.create({
      baseURL,
      timeout: 5 * 60 * 1000,
      headers: {
        "Content-Type": "application/json"
      }
    })

    const token = localStorage.getItem(STORAGE_AUTH_TOKEN_KEY)
    if (token) {
      this.token = token
    }
  }

  private getToken(): string | undefined {
    if (this.token) {
      return this.token
    } else {
      const token = localStorage.getItem(STORAGE_AUTH_TOKEN_KEY)
      if (token) {
        this.setToken(token)

        return token
      } else {
        return undefined
      }
    }
  }

  private setToken(token: string) {
    this.token = token
    localStorage.setItem(STORAGE_AUTH_TOKEN_KEY, token)
  }

  private authenticate(config: AxiosRequestConfig): Promise<AuthResponse> {
    return this.instance.request<AuthResponse>(config)
      .then(response => {
        this.setToken(response.data.token)

        return response.data
      }).catch(error =>
        // tslint:disable-next-line: no-unsafe-any
        Promise.reject(error.response.data)
      )
  }

  private withAuth<T>(config: AxiosRequestConfig): Promise<T> {
    const token = this.getToken()
    if (token) {
      return this.instance.request<T>({ ...config, headers: {
        ...config.headers,
        Authorization: token
      }}).then(response => response.data)
    } else {
      router.replace("/login")

      return Promise.reject()
    }
  }

  public login(login: Login): Promise<AuthResponse> {
    return this.authenticate({ url: "/api/users/login", method: "POST", data: login })
  }

  public signup(signup: Signup): Promise<AuthResponse> {
    return this.authenticate({ url: "/api/users/signup", method: "POST", data: signup })
  }

  public logout(): Promise<void> {
    return this.withAuth({ url: "/api/users/logout", method: "POST" })
      .then(() => router.replace("/login"))
      .catch(() => router.replace("/login"))
      .then(() => localStorage.removeItem(STORAGE_AUTH_TOKEN_KEY))
  }

  public loadMyRssSources(): Promise<MyRssSource[]> {
    return this.withAuth({ url: "/api/rss/sources", method: "GET" })
  }

  public searchRssSource(query: string): Promise<RssSource[]> {
    return this.withAuth({
      url: `/api/rss/sources/search?query=${query}`,
      method: "GET",
    })
  }

  public getUnfollowedRssSources(): Promise<RssSource[]> {
    return this.withAuth({
      url: `/api/rss/sources/unfollowed`,
      method: "GET",
    })
  }

  public followRssSource(rssSource: RssSource): Promise<MyRssSource> {
    return this.withAuth({
      url: `/api/rss/sources/${rssSource.uuid}/follow`,
      method: "POST",
    })
  }

  public getRssFeeds(reaction: Reaction, rssSourceUuid?: string): Promise<RssFeedsResponse[]> {
    return this.withAuth({
      url: `/api/rss/feeds${querystring({ reaction, rss_source_uuid: rssSourceUuid })}`,
      method: "GET",
    })
  }

  public feedReaction(rssFeed: RssFeed, reaction: Reaction): Promise<UserRssFeed> {
    return this.withAuth({
      url: `/api/rss/feeds/reaction`,
      method: "PUT",
      data: { rss_feed_uuid: rssFeed.uuid, reaction },
    })
  }
}

export const api = new ApiService()

export function querystring(queries: Record<string, string | undefined>): string {
  const querystrings = Object.keys(queries).filter(key => !!queries[key]).map(key => `${key}=${encodeURI(queries[key] || "")}`)
  if (querystrings.length > 0) {
    return `?${querystrings.join("&")}`
  } else {
    return ""
  }
}
