import * as React from "react"

interface Props {
  color?: string
  width?: number
  height?: number
  className?: string
}

export default class PreviousIcon extends React.PureComponent<Props> {
  render() {
  const { className, color = "#FFFFFF", width = 34, height = 34 } = this.props
  return (
      <svg fill={color} className={className} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z"/>
        <path d="M0 0h24v24H0z" fill="none"/>
      </svg>
    )
  }
}
