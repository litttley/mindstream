import Axios, { AxiosInstance, AxiosRequestConfig, AxiosError } from "axios"
import { Observable, Observer } from "rxjs"
import { Validator } from "validation.ts"
import * as router from "router"
import { RssFeed, Reaction } from "models/RssFeed"
import { RssSource } from "models/RssSource"
import { AuthResponse, AuthResponseValidator } from "services/AuthResponse"

export interface Requests {
    signup(login: string, email: string, password: string): Observable<AuthResponse>
    login(login: string, password: string): Observable<AuthResponse>
    logout(): Observable<void>
    loadUnreadedFeeds(token: string): Observable<RssFeed[]>
    loadUnfollowedSources(token: string): Observable<RssSource[]>
    loadMySources(token: string): Observable<RssSource[]>
    loadUnreadedFeedsBySource(token: string): (sourceUuid: string) => Observable<RssFeed[]>
    addSource(token: string): (url: string) => Observable<RssSource>
    fallowSource(token: string): (rssSource: RssSource) => Observable<RssSource>
    feedsByReaction(token: string): (reaction: Reaction) => Observable<RssFeed[]>
    feedReaction(token: string): (rssFeed: RssFeed, reaction: Reaction) => Observable<RssFeed>
}

type Request = <T>(config: AxiosRequestConfig, validator?: Validator<T>) => Observable<T>

export function createRequests(request: Request): Requests {
    return {
        login: (email, password) => request({
            url: "/api/users/login",
            method: "POST",
            data: { email, password }
        }, AuthResponseValidator),
        signup: (login, email, password) => request({
            url: "/api/users/signup",
            method: "POST",
            data: { login, email, password }
        }, AuthResponseValidator),
        logout: () => request({
            url: `/api/users/logout`,
            method: "POST",
        }),
        loadUnreadedFeeds: token => request({
            url: "/api/rss/feeds/unreaded",
            headers: { Authorization: token }
        }),
        loadUnfollowedSources: token => request({
            url: "/api/source/unfollowed",
            headers: { Authorization: token }
        }),
        loadMySources: token => request({
            url: "/api/source/my",
            headers: { Authorization: token }
        }),
        loadUnreadedFeedsBySource: token => sourceUuid => request({
            url: `/api/rss/feeds/unreaded?rss_source_uuid=${sourceUuid}`,
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
        // TODO create this route
        feedsByReaction: token => reaction => request({
            url: `/api/rss/feeds/${reaction}`,
            headers: { Authorization: token }
        }),
        feedReaction: token => (rssFeed, reaction) => request({
            url: `/api/rss/feeds/reaction`,
            method: "PUT",
            data: { rss_feed_uuid: rssFeed.uuid, reaction },
            headers: { Authorization: token }
        })
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
