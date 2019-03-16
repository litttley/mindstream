import { createHashHistory } from "history"

export const history = createHashHistory()

export function replace(path: string, params?: Record<string, string>) {
  history.replace(path, params)
}

export function push(path: string, params?: Record<string, string>) {
  history.push(path, params)
}
