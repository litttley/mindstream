import * as React from "react"

export type Update<S> = <K extends keyof S>(state: Pick<S, K> | S) => void

export interface Dispatcher<T> {
  update: Update<T>
}

export function createStore<T, K extends keyof T>(initialState: T, name?: string): [React.Context<T & Dispatcher<T>>, React.FunctionComponent] {
  const Context = React.createContext<T & Dispatcher<T>>({ ...initialState, update: s => s })
  const reducer: React.Reducer<T, Pick<T, K> | T> = (s, a) => ({ ...s, ...a })
  const Provider: React.FunctionComponent = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, initialState)
    const update: Update<T> = s => dispatch(s as Pick<T, K> | T)
    const value = { ...state, update }

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return [Context, Provider]
}

export function createPersistedStore<T, K extends keyof T>(
  initialState: T, key: string, storageEngine: Storage
): [React.Context<T & Dispatcher<T>>, React.FunctionComponent] {
  const maybeStoredData = storageEngine.getItem(key)
  const storedData = maybeStoredData ? JSON.parse(maybeStoredData) : initialState
  const Context = React.createContext<T & Dispatcher<T>>({ ...storedData, update: s => s })
  const reducer: React.Reducer<T, Pick<T, K> | T> = (s, a) => ({ ...s, ...a })

  const Provider: React.FunctionComponent = ({ children }) => {
    const [state, dispatch] = React.useReducer(reducer, storedData)
    const update: Update<T> = s => dispatch(s as Pick<T, K> | T)
    const value = { ...state, update }

    React.useEffect(() => {
      storageEngine.setItem(key, JSON.stringify(state))
    }, [state])

    return <Context.Provider value={value}>{children}</Context.Provider>
  }

  return [Context, Provider]
}
