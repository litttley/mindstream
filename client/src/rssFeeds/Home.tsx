import * as React from "react"
import { TopBar } from "~/components/TopBar"
import Container from "@material-ui/core/Container"
import Toolbar from "@material-ui/core/Toolbar"
// import { createStyles, makeStyles, Theme } from "@material-ui/core/styles"

export function Home() {
  // const classes = useStyles()

  return (
    <>
      <TopBar />
      <main>
        <Toolbar />
        <Container maxWidth="md">
            <div>Home</div>
        </Container>
      </main>
    </>
  )
}

// const useStyles = makeStyles((theme: Theme) => createStyles({
//   main: {
//   },
// }))
