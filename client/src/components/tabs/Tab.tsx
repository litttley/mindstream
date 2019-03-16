import * as React from "react"

export interface Props {
  name: string
  label: string
}

export function Tab({ children }: React.PropsWithChildren<Props>) {
  return <> {children} </>
}
