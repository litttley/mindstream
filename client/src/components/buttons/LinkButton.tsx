import * as React from "react"
import * as styles from "./LinkButton.css"
import BaseButton from "~/components/buttons/BaseButton"

interface Props {
  disable?: boolean
  href?: string
  onClick?: () => void
}

export default class LinkButton extends React.PureComponent<Props> {
  render() {
    const { href, children, disable, onClick } = this.props
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
}
