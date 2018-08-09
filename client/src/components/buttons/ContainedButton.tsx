import * as React from "react"
import * as styles from "./ContainedButton.css"
import LoaderIcon from "components/icons/LoaderIcon"
import BaseButton from "components/buttons/BaseButton"

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
        renderLoader={this.renderLoader}
      >
        <div className={styles.label}>{label}</div>
      </BaseButton>
    )
  }

  renderLoader = () => <LoaderIcon width={34} height={34} color="#FFFFFF" />
}
