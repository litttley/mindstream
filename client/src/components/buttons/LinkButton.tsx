import * as React from "react"
import * as styles from "./LinkButton.css"
import { BaseButton } from "~/components/buttons/BaseButton"

interface Props {
  disable?: boolean
  href?: string
  onClick?: () => void
}

export function LinkButton({ href, children, disable, onClick }: React.PropsWithChildren<Props>) {
  return (
    <BaseButton
      className={styles.linkButton}
      disable={disable}
      href={href}
      onClick={onClick}
    >
      {children}
    </BaseButton>
  )
}
