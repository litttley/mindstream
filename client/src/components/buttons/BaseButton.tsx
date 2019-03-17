import * as React from "react"
import { StyleSheet, css, CSSProperties, StyleDeclarationValue } from "aphrodite/no-important"
import { LoaderIcon } from "~/components/icons/LoaderIcon"

interface Props {
  disable?: boolean
  loading?: boolean
  style?: StyleDeclarationValue | Array<StyleDeclarationValue | undefined>
  onClick?(): void
  href?: string
  renderLoader?: () => React.ReactNode
}

export function BaseButton(props: React.PropsWithChildren<Props>) {
  const { children, renderLoader, onClick, style, href, disable = false, loading = false } = props

  const classes = css(styles.baseButton, style)

  const handleOnClick = () => {
    if (!disable && !loading && onClick) {
      onClick()
    }
  }

  const renderContent = () => {
    if (loading) {
      return renderLoader !== undefined ? renderLoader() : <LoaderIcon width={34} height={34} color="#FFFFFF" />
    } else {
      return children
    }
  }

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

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  baseButton: {
    cursor: "pointer",
    outline: "none",
    textDecoration: "none",
    appearance: "none",
    background: "none",
  },
})
