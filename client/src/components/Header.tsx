import * as React from "react"
import * as styles from "./Header.css"
import MenuIcon from "./icons/MenuIcon"

interface Props {
  onMenuToggle(isMenuOpen: boolean): void
  isMenuOpen?: boolean
}

export default class Header extends React.PureComponent<Props> {
  render() {
    return (
      <div className={styles.header}>
        <div className={styles.menuToggle} onClick={this.handleOnMenuToggle}>
          <MenuIcon />
        </div>
        <div className={styles.appName}>
          <div>Mindstream</div>
        </div>
      </div>
    )
  }

  handleOnMenuToggle = () => {
    const { onMenuToggle, isMenuOpen } = this.props
    onMenuToggle(!isMenuOpen)
  }
}
