interface ApiError {
  message: string
  errors?: Record<string, string>
}

export class Api {
  private readonly baseUrl: string

  public constructor(baseUrl: string) {
    this.baseUrl = baseUrl
  }

  // tslint:disable-next-line: no-any
  public login(email: string, password: string): Promise<any> {
    return fetch(`${this.baseUrl}/api/users/login`, {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ email, password })
    }).then(response => {
      if (response.status >= 200 && response.status < 300) {
        return response.json()
      } else if (response.status === 400) {
        return response.json().then(errors => Promise.reject(errors))
      } else if (response.status === 401) {
        return Promise.reject({ message: "Unauthorized" })
      } else {
        return Promise.reject({ message: "Technical error" })
      }
    })
  }
}

export const api = new Api("https://mindstream.news")
