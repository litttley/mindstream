// tslint:disable: no-import-side-effect
import "core-js/es/promise"
import "core-js/es/array/find"
import "~/reset.css"
import "~/guide-styles.css"
// tslint:enable: no-import-side-effect
import * as React from "react"
import * as ReactDOM from "react-dom"
import { App } from "~/App"

ReactDOM.render(<App />, document.getElementById("app"))
