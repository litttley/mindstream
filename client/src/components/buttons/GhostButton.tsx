import * as React from "react"
import classNames from "classnames"
import * as styles from "./GhostButton.css"
import BaseButton from "~/components/buttons/BaseButton"

interface Props {
  label: string
  loading?: boolean
  disable?: boolean
  onClick?: () => void
  href?: string
  className?: string
}

export default function GhostdButton({ href, label, loading, disable, onClick, className }: Props) {
  return (
    <BaseButton
      className={classNames(styles.ghostButton, className)}
      loading={loading}
      disable={disable}
      href={href}
      onClick={onClick}
    >
      {label}
    </BaseButton>
  )
}
