import * as React from "react"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

import { TopBarMenu } from "./TopBarMenu"

export function TopBar() {
  const classes = useStyles()

  return (
    <AppBar>
      <Toolbar>
        <Typography className={classes.title} variant="h6" color="inherit" noWrap>
          Mindstream
        </Typography>
        <TopBarMenu />
      </Toolbar>
    </AppBar>
  )
}

const useStyles = makeStyles((theme: Theme) => createStyles({
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}))
