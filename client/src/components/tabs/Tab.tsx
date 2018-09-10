import * as React from "react"

export interface Props {
  name: string
  label: string
}

export default class Tab extends React.PureComponent<Props> {
  render() {
    const { children } = this.props
    return (
      <>
        {children}
      </>
    )
  }
}
