import React from "react"
import { withRouter, RouteComponentProps } from "react-router-dom"

import { makeStyles, Theme } from "@material-ui/core/styles"
import List from "@material-ui/core/List"
import ListItem from "@material-ui/core/ListItem"
import ListItemText from "@material-ui/core/ListItemText"
import Badge from "@material-ui/core/Badge"

import { MyRssSource } from "~/models/rssSource"

interface Props {
  myRssSources: MyRssSource[]
}

function Menu({ myRssSources, history }: Props & RouteComponentProps) {
  const classes = useStyles()

  return (
    <List>
      {myRssSources.map(myRssSource => (
        <ListItem
          button
          onClick={() => history.push(`/rss/feeds/${myRssSource.rss_source.uuid}`)}
          key={myRssSource.rss_source.uuid}
        >
          <Badge badgeContent={myRssSource.unreaded} color="primary" max={1000} className={classes.badge}>
            {""}
          </Badge>
          <ListItemText primary={myRssSource.rss_source.title} className={classes.text} />
        </ListItem>
      ))}
    </List>
  )
}

export const MyRssFeedsMenu = withRouter(Menu)

const useStyles = makeStyles((theme: Theme) => ({
  link: {
    ...theme.typography.body1
  },
  badge: {
    marginLeft: 5
  },
  text: {
    marginLeft: 20
  }
}))
