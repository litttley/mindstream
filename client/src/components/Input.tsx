import * as React from "react"
import classNames from "classnames"
import * as styles from "./Input.css"

interface Props {
  label: string
  value: string
  error?: string
  type: string
  onChange: (event: React.FormEvent<HTMLInputElement>) => void
}

export function Input({ label, type, error, value, onChange }: Props) {
  return (
    <div className={styles.container}>
      <label className={styles.label}>{label}</label>
      <input className={styles.input} type={type} value={value} onChange={onChange} />
      <div className={classNames(styles.error, { [styles.hideError]: !error })}>{error}</div>
    </div>
  )
}
