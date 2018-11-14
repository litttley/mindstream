import * as React from "react"
import * as styles from "./IconButton.css"
import BaseButton from "~/components/buttons/BaseButton"
import classNames from "~/utils/classNames"

interface Props {
  loading?: boolean
  disable?: boolean
  href?: string
  className?: string
  onClick?: () => void
}

export default class IconButton extends React.PureComponent<Props> {
  render() {
    const { children, loading, disable, href, onClick, className } = this.props
    const classes = classNames({
      [styles.iconButton]: true,
      [className || ""]: !!className,
    })
    return (
      <BaseButton
        loading={loading}
        className={classes}
        disable={disable}
        href={href}
        onClick={onClick}
      >
        {children}
      </BaseButton>
    )
  }
}
