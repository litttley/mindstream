import Axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios"
import { Observable, Observer } from "rxjs"
import { Validator, array } from "validation.ts"
import * as router from "~/router"
import { RssFeed, Reaction, UserRssFeed, UserRssFeedValidator } from "~/models/RssFeed"
import { RssSource, MyRssSource } from "~/models/RssSource"
import { AuthResponse, AuthResponseValidator } from "~/services/AuthResponse"
import { Login } from "~/auth/Login"
import { Signup } from "~/auth/Signup"
import { RssFeedsResponse, RssFeedsResponseValidator } from "~/services/RssFeedsResponse"

export interface Requests {
  signup(signup: Signup): Observable<AuthResponse>
  login(login: Login): Observable<AuthResponse>
  logout(): Observable<void>
  loadUnfollowedSources(token: string): Observable<RssSource[]>
  loadMySources(token: string): Observable<MyRssSource[]>
  addSource(token: string): (url: string) => Observable<RssSource>
  fallowSource(token: string): (rssSource: RssSource) => Observable<RssSource>
  getRssFeeds(token: string, reaction: Reaction, sourceUuid?: string): Observable<RssFeedsResponse[]>
  feedReaction(token: string): (rssFeed: RssFeed, reaction: Reaction) => Observable<UserRssFeed>
}

type Request = <T>(config: AxiosRequestConfig, validator?: Validator<T>) => Observable<T>

export function createRequests(request: Request): Requests {
  return {
    login: login => request({
      url: "/api/users/login",
      method: "POST",
      data: login
    }, AuthResponseValidator),
    signup: signup => request({
      url: "/api/users/signup",
      method: "POST",
      data: signup
    }, AuthResponseValidator),
    logout: () => request({
      url: `/api/users/logout`,
      method: "POST",
    }),
    loadUnfollowedSources: token => request({
      url: "/api/source/unfollowed",
      headers: { Authorization: token }
    }),
    loadMySources: token => request({
      url: "/api/source/my",
      headers: { Authorization: token }
    }),
    addSource: token => url => request({
      url: `/api/source/add`,
      method: "POST",
      data: { url },
      headers: { Authorization: token }
    }),
    fallowSource: token => rssSource => request({
      url: `/api/source/${rssSource.uuid}/fallow`,
      method: "POST",
      headers: { Authorization: token }
    }),
    getRssFeeds: (token, reaction, sourceUuid) => request({
      url: `/api/rss/feeds${querystring({ reaction, rss_source_uuid: sourceUuid })}`,
      headers: { Authorization: token }
    }, array(RssFeedsResponseValidator)),
    feedReaction: token => (rssFeed, reaction) => request({
      url: `/api/rss/feeds/reaction`,
      method: "PUT",
      data: { rss_feed_uuid: rssFeed.uuid, reaction },
      headers: { Authorization: token }
    }, UserRssFeedValidator)
  }
}

export function createApiInstance(baseURL?: string): Requests {
  const instance = Axios.create({
    baseURL,
    timeout: 5 * 60 * 1000,
    headers: {
      "Content-Type": "application/json"
    }
  })
  return createRequests(createRequest(instance))
}

// TODO refactor
export function createRequest(instance: AxiosInstance): Request {
  return <T>(config: AxiosRequestConfig, validator?: Validator<T>) => {
    return Observable.create((observer: Observer<T>) => {
      const source = Axios.CancelToken.source()
      const cancelToken = source.token
      instance.request<T>({ ...config, cancelToken })
      .then(response => {
        if (validator) {
          validator.validate(response.data).mapError(err => {
            console.error("Serveur Api validation fail", config.url, err)
          })
        }
        observer.next(response.data)
        observer.complete()
      })
      .catch((error: AxiosError) => {
        console.log("createRequest error", error)
        if (error.response && error.response.status === 401) {
          router.replace("/login")
          observer.error(error.response.data)
        } else if (error.response && error.response.data) {
          observer.error(error.response.data)
        } else {
          observer.error(error)
        }
      })
      return () => source.cancel()
    })
  }
}

export default function querystring(queries: Record<string, string | undefined>): string {
  const querystrings = Object.keys(queries).filter(key => !!queries[key]).map(key => `${key}=${encodeURI(queries[key]!)}`)
  if (querystrings.length > 0) {
    return `?${querystrings.join("&")}`
  } else {
    return ""
  }
}
