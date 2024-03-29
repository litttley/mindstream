import * as React from "react"
import { IconProps } from "./iconProps"

export function AddIcon({ className, color = "#000000", width = 24, height = 24 }: IconProps) {
  return (
    <svg className={className} fill={color} width={width} height={height} viewBox="0 0 24 24">
      <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
      <path d="M0 0h24v24H0z" fill="none" />
    </svg>
  )
}
