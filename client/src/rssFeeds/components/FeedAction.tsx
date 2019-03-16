import * as React from "react"
import classNames from "classnames"
import * as styles from "./FeedAction.css"
import { IconButton } from "~/components/buttons/IconButton"

interface FeedActionProps {
  icon: React.ReactNode
  loading: boolean
  className: string
  onClick: () => void
}

export function FeedAction({ icon, loading, className, onClick }: FeedActionProps) {
  return (
    <IconButton className={classNames(styles.action, className)} loading={loading} onClick={onClick}>
      {icon}
    </IconButton>
  )
}
