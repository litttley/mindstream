import * as React from "react"
import classNames from "classnames"
import * as styles from "./IconButton.css"
import { BaseButton } from "~/components/buttons/BaseButton"

interface Props {
  loading?: boolean
  disable?: boolean
  href?: string
  className?: string
  onClick?: () => void
}

export function IconButton({ children, loading, disable, href, onClick, className }: React.PropsWithChildren<Props>) {
  return (
    <BaseButton
      loading={loading}
      className={classNames(styles.iconButton, className)}
      disable={disable}
      href={href}
      onClick={onClick}
    >
      {children}
    </BaseButton>
  )
}
