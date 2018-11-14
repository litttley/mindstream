import * as React from "react"
import * as styles from "./GhostButton.css"
import BaseButton from "~/components/buttons/BaseButton"

interface Props {
  label: string
  loading?: boolean
  disable?: boolean
  onClick: () => void
}

export default class GhostdButton extends React.PureComponent<Props> {
  render() {
    const { label, loading, disable, onClick } = this.props
    return (
      <BaseButton
        className={styles.ghostButton}
        loading={loading}
        disable={disable}
        onClick={onClick}
      >
        {label}
      </BaseButton>
    )
  }
}
