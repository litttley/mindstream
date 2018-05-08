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
                {this.props.isMenuOpen ?
                    <div className={styles.links}>
                        <a className={styles.item} href="#/">MindStream</a>
                        <a className={styles.item} href="#/feeds">Feeds</a>
                        <a className={styles.item} href="#/sources">Sources</a>
                        <div className={styles.item}>TODO Logout</div>
                    </div>
                : null }
            </div>
        )
    }

    handleOnMenuToggle = () => {
        const { onMenuToggle, isMenuOpen } = this.props
        onMenuToggle(!isMenuOpen)
    }
}
