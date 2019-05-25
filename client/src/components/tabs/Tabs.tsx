import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { Props as TabProps } from "./Tab"
import { colors } from "~/guideStyles"

interface Props {
  selectedTabName: string
  onChange: (tab: string) => void
}

function isReactElement<T>(rc: React.ReactNode): rc is React.ReactElement<T> {
  const re = rc as React.ReactElement<T>

  return !!re.type && !!re.props
}

export function Tabs({ children, onChange, selectedTabName }: React.PropsWithChildren<Props>) {
  const childrens = React.Children.toArray(children)
  const tabs = childrens.filter(isReactElement)
  const labels = tabs.map(ch => ch.props as TabProps)
  const SelectedTab = tabs.find(ch => (ch.props as TabProps).name === selectedTabName)

  const handleTabOnClick = (tab: string) => React.useCallback(() => onChange(tab), [tab])

  const renderTab = (props: TabProps) => {
    const classes = css(styles.tab, selectedTabName === props.name ? styles.selected : undefined)

    return (
      <div key={props.name} className={classes} onClick={handleTabOnClick(props.name)}>
        {props.label}
      </div>
    )
  }

  return (
    <div className={css(styles.tabsContainer)}>
      <div className={css(styles.tabs)}>{labels.map(renderTab)}</div>
      <div>{SelectedTab}</div>
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  tabsContainer: {
    width: "100%"
  },
  tabs: {
    width: "100%",
    display: "inline-flex"
  },
  tab: {
    flex: 1,
    justifyContent: "space-between",
    alignItems: "center",
    textAlign: "center",
    fontSize: ".8rem",
    textTransform: "uppercase",
    paddingTop: 13,
    paddingBottom: 13,
    borderTopWidth: 2,
    borderTopStyle: "solid",
    borderTopColor: colors.secondaryClear,
    color: colors.secondary,
    cursor: "pointer",
    ":hover": {
      color: colors.accent
    }
  },
  selected: {
    borderTopColor: colors.secondary,
    color: colors.secondary,
    ":hover": {
      color: colors.accent
    }
  }
})
