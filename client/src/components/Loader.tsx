import * as React from "react"
import * as styles from "./Loader.css"
import { LoaderIcon } from "./icons/LoaderIcon"

interface Props {
  size?: number
  paddingTop?: string
}

export function Loader({ size = 60, paddingTop = "30px" }: Props) {
  return (
    <div className={styles.loader} style={{ paddingTop }}>
      <LoaderIcon width={size} height={size} />
    </div>
  )
}
