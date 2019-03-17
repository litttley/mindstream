import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { LoaderIcon } from "./icons/LoaderIcon"

interface Props {
  size?: number
  paddingTop?: string
}

export function Loader({ size = 60, paddingTop = "30px" }: Props) {
  return (
    <div className={css(styles.loader)} style={{ paddingTop }}>
      <LoaderIcon width={size} height={size} />
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  loader: {
    display: "flex",
    justifyContent: "center",
  },
})
