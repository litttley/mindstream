import * as React from "react"
import * as styles from "./AuthLayout.css"

export function AuthLayout({ children }: React.PropsWithChildren<{}>) {
  return (
    <div className={styles.authLayout}>
      <h1 className={styles.appName}>Mindstream</h1>
      {children}
    </div>
  )
}
