import * as React from "react"

interface Props {
  color?: string
  width?: number
  height?: number
  className?: string
}

export default class NextIcon extends React.PureComponent<Props> {
  render() {
  const { className, color = "#FFFFFF", width = 34, height = 34 } = this.props
  return (
      <svg fill={color} className={className} width={width} height={height} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 6L8.59 7.41 13.17 12l-4.58 4.59L10 18l6-6z" />
        <path d="M0 0h24v24H0z" fill="none" />
      </svg>
    )
  }
}