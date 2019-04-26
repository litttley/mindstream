import * as React from "react"
import { IconProps } from "./iconProps"

export function CloseIcon({ className, color = "#000000", width = 24, height = 24 }: IconProps) {
  return (
    <svg className={className} width={width} height={height} viewBox="0 0 24 24">
      <path fill={color} d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      <path d="M0 0h24v24H0z" fill="none"/>
    </svg>
  )
}
