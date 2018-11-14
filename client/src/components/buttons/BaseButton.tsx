import * as React from "react"
import classNames from "~/utils/classNames"
import * as styles from "./BaseButton.css"
import LoaderIcon from "~/components/icons/LoaderIcon"

interface Props {
  disable?: boolean
  loading?: boolean
  className?: string
  onClick?(): void
  href?: string
  renderLoader?: () => React.ReactNode
}

export default class BaseButton extends React.PureComponent<Props> {
  render() {
    const { className, href } = this.props
    const classes = classNames({
      [styles.baseButton]: true,
      [className || ""]: !!className,
    })
    if (href) {
      return (
        <a href={href} role="button" className={classes} onClick={this.handleOnClick}>
          {this.renderContent()}
        </a>
      )
    } else {
      return (
        <button role="button" className={classes} onClick={this.handleOnClick}>
          {this.renderContent()}
        </button>
      )
    }
  }

  renderContent = () => {
    const { children, renderLoader, loading = false } = this.props
    if (loading) {
      return renderLoader !== undefined ? renderLoader() : this.renderDefaultLoader()
    } else {
      return children
    }
  }

  handleOnClick = () => {
    const { onClick, disable = false, loading = false } = this.props
    if (!disable && !loading && onClick) {
      onClick()
    }
  }

  renderDefaultLoader = () => <LoaderIcon width={34} height={34} color="#FFFFFF" />
}
