import * as React from "react"
import * as styles from "./GhostButton.css"
import BaseButton from "~/components/buttons/BaseButton"
import classNames from "~/utils/classNames"

interface Props {
  label: string
  loading?: boolean
  disable?: boolean
  onClick: () => void
  className?: string
}

export default class GhostdButton extends React.PureComponent<Props> {
  render() {
    const { label, loading, disable, onClick, className } = this.props
    const classes = classNames({
      [styles.ghostButton]: true,
      [className || ""]: !!className
    })
    return (
      <BaseButton
        className={classes}
        loading={loading}
        disable={disable}
        onClick={onClick}
      >
        {label}
      </BaseButton>
    )
  }
}
