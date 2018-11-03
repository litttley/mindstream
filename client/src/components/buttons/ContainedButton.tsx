import * as React from "react"
import * as styles from "./ContainedButton.css"
import BaseButton from "~/components/buttons/BaseButton"

interface Props {
  label: string
  loading?: boolean
  disable?: boolean
  onClick: () => void
}

export default class ContainedButton extends React.PureComponent<Props> {
  render() {
    const { label, loading, disable, onClick } = this.props
    return (
      <BaseButton
        className={styles.ghostButton}
        loading={loading}
        disable={disable}
        onClick={onClick}
      >
        <div className={styles.label}>{label}</div>
      </BaseButton>
    )
  }
}
