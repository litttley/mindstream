import * as React from "react"
import * as styles from "./LinkButton.css"
import BaseButton from "~/components/buttons/BaseButton"

interface Props {
  disable?: boolean
  href?: string
  onClick?: () => void
}

const LinkButton: React.FunctionComponent<Props> = ({ href, children, disable, onClick }) => {
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

export default LinkButton
