import * as React from "react"
import * as styles from "./AuthLayout.css"

const AuthLayout: React.SFC = ({ children }) => {
  return (
    <div className={styles.authLayout}>
      <h1 className={styles.appName}>Mindstream</h1>
      {children}
    </div>
  )
}

export default AuthLayout
