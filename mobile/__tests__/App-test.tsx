// tslint:disable-next-line: no-import-side-effect
import "react-native"
import React from "react"
import { App } from "../src/App"

import renderer from "react-test-renderer"

it("renders correctly", () => {
  renderer.create(<App />)
})
