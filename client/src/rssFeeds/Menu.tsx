import React from "react"

import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemIcon from "@material-ui/core/ListItemIcon"
import ListItemText from "@material-ui/core/ListItemText"
import Divider from "@material-ui/core/Divider"
import { default as StarIcon } from "@material-ui/icons/Star"
import { default as RssFeedIcon } from "@material-ui/icons/RssFeed"

import { useIntlMessage } from "~/hooks/useIntlMessage"

export function Menu() {
  const message = useIntlMessage()

  return (
    <>
      <List>
        <ListItem button>
          <ListItemIcon>
            <StarIcon />
          </ListItemIcon>
          <ListItemText primary={message("menu.feeds")} />
        </ListItem>
        <ListItem button>
          <ListItemIcon>
            <RssFeedIcon />
          </ListItemIcon>
          <ListItemText primary={message("menu.rssSources")} />
        </ListItem>
      </List>
      <Divider />
    </>
  )
}
