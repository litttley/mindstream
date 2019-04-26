import * as React from "react"

export interface Props {
  name: string
  label: string
}

export const Tab: React.FunctionComponent<Props> = ({ children }) => <> {children} </>
