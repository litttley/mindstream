import * as React from "react"
import * as styles from "./Empty.css"

interface Props {
  message: string
}

export default function Empty({ message }: Props) {
  return (
    <div className={styles.empty}>{message}</div>
  )
}
