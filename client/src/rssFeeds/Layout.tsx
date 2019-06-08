import React from "react"
import clsx from "clsx"
import { makeStyles, useTheme, Theme } from "@material-ui/core/styles"
import Drawer from "@material-ui/core/Drawer"
import CssBaseline from "@material-ui/core/CssBaseline"
import AppBar from "@material-ui/core/AppBar"
import Toolbar from "@material-ui/core/Toolbar"
import Typography from "@material-ui/core/Typography"
import Divider from "@material-ui/core/Divider"
import IconButton from "@material-ui/core/IconButton"
import { default as MenuIcon } from "@material-ui/icons/Menu"
import { default as ChevronLeftIcon } from "@material-ui/icons/ChevronLeft"
import { default as ChevronRightIcon } from "@material-ui/icons/ChevronRight"

import { TopBarMenu } from "~/components/TopBarMenu"
import { Menu } from "./Menu"
import { MyRssFeedsMenu } from "./MyRssFeedsMenu"
import { useMyRssSources } from "~/rssSources/RssSourcesState"
import { useMenuToggle } from "~/states/AppState"

export function Layout({ children }: React.PropsWithChildren<{}>) {
  const classes = useStyles()
  const theme = useTheme()
  const { loadMySources, myRssSources } = useMyRssSources()
  const { isMenuOpen, menuToggle } = useMenuToggle()

  function handleDrawerOpen() {
    menuToggle(true)
  }

  function handleDrawerClose() {
    menuToggle(false)
  }

  React.useEffect(() => {
    loadMySources()
  }, [])

  return (
    <div className={classes.root}>
      <CssBaseline />
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: isMenuOpen
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Open drawer"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, isMenuOpen && classes.hide)}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap className={classes.appTitle}>
            Mindstream
          </Typography>
          <TopBarMenu />
        </Toolbar>
      </AppBar>
      <Drawer
        className={classes.drawer}
        variant="persistent"
        anchor="left"
        open={isMenuOpen}
        classes={{
          paper: classes.drawerPaper
        }}
      >
        <div className={classes.drawerHeader}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "ltr" ? <ChevronLeftIcon /> : <ChevronRightIcon />}
          </IconButton>
        </div>
        <Divider />
        <Menu />
        <MyRssFeedsMenu myRssSources={myRssSources} />
      </Drawer>
      <main
        className={clsx(classes.content, {
          [classes.contentShift]: isMenuOpen
        })}
      >
        <div className={classes.drawerHeader} />
        <div>{children}</div>
      </main>
    </div>
  )
}

const drawerWidth = 240

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: "flex"
  },
  appBar: {
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    })
  },
  appBarShift: {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: drawerWidth,
    transition: theme.transitions.create(["margin", "width"], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  },
  appTitle: {
    flexGrow: 1
  },
  menuButton: {
    marginRight: theme.spacing(2)
  },
  hide: {
    display: "none"
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
  },
  drawerHeader: {
    display: "flex",
    alignItems: "center",
    padding: "0 8px",
    ...theme.mixins.toolbar,
    justifyContent: "flex-end"
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: -drawerWidth
  },
  contentShift: {
    transition: theme.transitions.create("margin", {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginLeft: 0
  }
}))
