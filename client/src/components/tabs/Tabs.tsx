import * as React from "react"
import * as styles from "./Tabs.css"
import { Props as TabProps } from "./Tab"
import classNames from "utils/classNames"

interface Props {
  selectedTabName: string
  onChange: (tab: string) => void
}

function isReactElement<T>(rc: React.ReactChild): rc is React.ReactElement<T> {
  const re = rc as React.ReactElement<T>
  return !!re.type && !!re.props
}

export default class Tabs extends React.PureComponent<Props> {
  render() {
    const { children, selectedTabName } = this.props
    const childrens = React.Children.map(children, ch => ch)
    const tabs = childrens.filter(isReactElement)
    const labels = tabs.map(ch => ch.props as TabProps)
    const SelectedTab = tabs.find(ch => (ch.props as TabProps).name === selectedTabName)
    return (
      <div className={styles.tabsContainer}>
        <div className={styles.tabs}>
          {labels.map(this.renderTab)}
        </div>
        <div>
          {SelectedTab}
        </div>
      </div>
    )
  }

  renderTab = (props: TabProps) => {
    const { selectedTabName } = this.props
    const classes = classNames({
      [styles.tab]: true,
      [styles.selected]: selectedTabName === props.name
    })
    return (
      <div key={props.name} className={classes} onClick={this.handleTabOnClick(props.name)}>
        {props.label}
      </div>
    )
  }

  handleTabOnClick = (tab: string) => () => this.props.onChange(tab)
}
