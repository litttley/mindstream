import * as React from "react"
import classNames from "classnames"
import * as styles from "./BaseButton.css"
import { LoaderIcon } from "~/components/icons/LoaderIcon"

interface Props {
  disable?: boolean
  loading?: boolean
  className?: string
  onClick?(): void
  href?: string
  renderLoader?: () => React.ReactNode
}

export function BaseButton(props: React.PropsWithChildren<Props>) {
  const { href, onClick, disable = false, loading = false, renderLoader, children, className } = props
  const renderContent = () => {
    if (loading) {
      return renderLoader !== undefined ? renderLoader() : <LoaderIcon width={34} height={34} color="#FFFFFF" />
    } else {
      return children
    }
  }

  const handleOnClick = () => {
    if (!disable && !loading && onClick) {
      onClick()
    }
  }

  const classes = classNames(styles.baseButton, className)
  if (href) {
    return (
      <a href={href} role="button" className={classes} onClick={handleOnClick}>
        {renderContent()}
      </a>
    )
  } else {
    return (
      <button role="button" className={classes} onClick={handleOnClick}>
        {renderContent()}
      </button>
    )
  }
}
