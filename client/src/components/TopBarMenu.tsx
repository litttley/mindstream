import * as React from "react"
import IconButton from "@material-ui/core/IconButton"
import { default as AccountCircle } from "@material-ui/icons/AccountCircle"
import MenuItem from "@material-ui/core/MenuItem"
import Menu from "@material-ui/core/Menu"

export function TopBarMenu() {
  const [anchorEl, setAnchorEl] = React.useState<undefined | HTMLElement>(undefined)
  const isMenueOpen = !!anchorEl

  function handleMenu(event: React.MouseEvent<HTMLElement>) {
    setAnchorEl(event.currentTarget)
  }

  function handleClose() {
    setAnchorEl(undefined)
  }

  return (
    <>
      <IconButton
        aria-owns={open ? "menu-appbar" : undefined}
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={isMenueOpen}
        onClose={handleClose}
      >
        <MenuItem onClick={handleClose}>Profile</MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  )
}
