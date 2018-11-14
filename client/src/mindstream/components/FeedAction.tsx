import * as React from "react"
import * as styles from "./FeedAction.css"
import classNames from "~/utils/classNames"
import IconButton from "~/components/buttons/IconButton"

interface FeedActionProps {
  icon: React.ReactNode
  loading: boolean
  className: string
  onClick(): void
}

export default class FeedAction extends React.PureComponent<FeedActionProps> {
  render() {
    const { icon, loading, className, onClick } = this.props
    const classes = classNames({
      [styles.action]: true,
      [className]: true
    })
    return (
      <IconButton className={classes} loading={loading} onClick={onClick}>
        {icon}
      </IconButton>
    )
  }
}
