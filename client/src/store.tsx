import * as React from "react"

export interface Dispatcher<S> {
  update: React.Dispatch<S>
}

export function createStore<T>(initialState: T): [React.Context<T & Dispatcher<T>>, React.FunctionComponent] {
  const Context = React.createContext<T & Dispatcher<T>>({ ...initialState, update: s => s })
  const Provider: React.FunctionComponent = ({ children }) => {
    const [state, update] = React.useState(initialState)
    const value = { ...state, update }
    return (
      <Context.Provider value={value}>{children}</Context.Provider>
    )
  }
  return [Context, Provider]
}

export function createPersistedStore<T>(
  initialState: T, key: string, storageEngine: Storage
): [React.Context<T & Dispatcher<T>>, React.FunctionComponent] {
  const maybeStoredData = storageEngine.getItem(key)
  const storedData = maybeStoredData ? JSON.parse(maybeStoredData) : initialState
  const Context = React.createContext<T & Dispatcher<T>>({ ...storedData, update: s => s })
  const Provider: React.FunctionComponent = ({ children }) => {
    const [state, update] = React.useState(storedData)
    const value = { ...state, update }
    React.useEffect(() => {
      storageEngine.setItem(key, JSON.stringify(state))
    }, [state])
    return (
      <Context.Provider value={value}>{children}</Context.Provider>
    )
  }
  return [Context, Provider]
}
