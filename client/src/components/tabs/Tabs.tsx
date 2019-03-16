import * as React from "react"
import classNames from "classnames"
import * as styles from "./Tabs.css"
import { Props as TabProps } from "./Tab"

interface Props {
  selectedTabName: string
  onChange: (tab: string) => void
}

function isReactElement<T>(rc: React.ReactNode): rc is React.ReactElement<T> {
  const re = rc as React.ReactElement<T>

  return !!re.type && !!re.props
}

export function Tabs({ children, onChange, selectedTabName }: React.PropsWithChildren<Props>) {
  const childrens = React.Children.map(children, ch => ch)
  const tabs = childrens.filter(isReactElement)
  const labels = tabs.map(ch => ch.props as TabProps)
  const SelectedTab = tabs.find(ch => (ch.props as TabProps).name === selectedTabName)

  const handleTabOnClick = (tab: string) => React.useCallback(() => onChange(tab), [tab])

  const renderTab = (props: TabProps) => {
    const classes = classNames(styles.tab, { [styles.selected]: selectedTabName === props.name })

    return (
      <div key={props.name} className={classes} onClick={handleTabOnClick(props.name)}>
        {props.label}
      </div>
    )
  }

  return (
    <div className={styles.tabsContainer}>
      <div className={styles.tabs}>
        {labels.map(renderTab)}
      </div>
      <div>
        {SelectedTab}
      </div>
    </div>
  )
}
