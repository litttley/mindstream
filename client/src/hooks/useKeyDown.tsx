import * as React from "react"

export function useKeyDown(onKeyDown: (event: KeyboardEvent) => void) {
  React.useEffect(() => {
    document.addEventListener("keydown", onKeyDown, false)

    return () => document.removeEventListener("keydown", onKeyDown, false)
  })
}
