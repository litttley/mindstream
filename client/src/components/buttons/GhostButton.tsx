import * as React from "react"
import classNames from "classnames"
import * as styles from "./GhostButton.css"
import BaseButton from "~/components/buttons/BaseButton"

interface Props {
  label: string
  loading?: boolean
  disable?: boolean
  onClick: () => void
  className?: string
}

export default function GhostdButton({ label, loading, disable, onClick, className }: Props) {
  return (
    <BaseButton
      className={classNames(styles.ghostButton, className)}
      loading={loading}
      disable={disable}
      onClick={onClick}
    >
      {label}
    </BaseButton>
  )
}
