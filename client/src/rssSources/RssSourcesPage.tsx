import * as React from "react"
import * as styles from "./RssSourcesPage.css"
import HeaderContainer from "app/HeaderContainer"
import UnfollowedRssSourcesContainer from "rssSources/UnfollowedRssSourcesContainer"
import MyRssSourcesContainer from "rssSources/MyRssSourcesContainer"
import AddRssSourceContainer from "rssSources/AddRssSourceContainer"

const RssSourcesPage: React.SFC = () => (
    <div className={styles.sourcesContainer}>
        <HeaderContainer />
        <AddRssSourceContainer />
        <h3>Sources</h3>
        <UnfollowedRssSourcesContainer />
        <h3>My Sources</h3>
        <MyRssSourcesContainer />
    </div>
)

export default RssSourcesPage
