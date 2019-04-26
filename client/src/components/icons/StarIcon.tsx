import * as React from "react"
import { IconProps } from "./iconProps"

export function StarIcon({ className, color = "#000000", width = 34, height = 34 }: IconProps) {
  return (
    <svg fill={color} className={className} width={width} height={height} viewBox="0 0 18 18" xmlns="http://www.w3.org/2000/svg">
      <path d="M9 11.3l3.71 2.7-1.42-4.36L15 7h-4.55L9 2.5 7.55 7H3l3.71 2.64L5.29 14z"/>
      <path fill="none" d="M0 0h18v18H0z"/>
    </svg>
  )
}
