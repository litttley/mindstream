import * as React from "react"
import HeaderContainer from "~/app/HeaderContainer"
import RssSourcesContainer from "~/rssSources/RssSourcesContainer"
import SearchRssSourceContainer from "~/rssSources/SearchRssSourceContainer"
import SideMenuContainer from "~/app/SideMenuContainer"
import MenuContainer from "~/app/MenuContainer"

const RssSourcesPage = () => (
  <SideMenuContainer renderMenu={() => <MenuContainer />}>
    <HeaderContainer />
    <SearchRssSourceContainer />
    <RssSourcesContainer />
  </SideMenuContainer>
)

export default RssSourcesPage
