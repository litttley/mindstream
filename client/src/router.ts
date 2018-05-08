import createHashHistory from "history/createHashHistory"
export const history = createHashHistory()

export function replace(path: string, params?: Record<string, string>) {
    history.replace(path, params)
}
