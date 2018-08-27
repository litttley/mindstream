import * as React from "react"
import HeaderContainer from "app/HeaderContainer"
import UnfollowedRssSourcesContainer from "rssSources/UnfollowedRssSourcesContainer"
import MyRssSourcesContainer from "rssSources/MyRssSourcesContainer"
import AddRssSourceContainer from "rssSources/AddRssSourceContainer"
import SideMenuContainer from "app/SideMenuContainer"
import MenuContainer from "app/MenuContainer"

const RssSourcesPage: React.SFC = () => (
  <SideMenuContainer renderMenu={() => <MenuContainer />}>
    <HeaderContainer />
    <AddRssSourceContainer />
    <h3>Sources</h3>
    <UnfollowedRssSourcesContainer />
    <h3>My Sources</h3>
    <MyRssSourcesContainer />
  </SideMenuContainer>
)

export default RssSourcesPage
