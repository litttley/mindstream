import * as React from "react"

export interface Props {
  name: string
  label: string
}

const Tab: React.FunctionComponent<Props> = ({ children }) => <> {children} </>
export default Tab
