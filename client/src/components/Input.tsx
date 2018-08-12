import * as React from "react"
import * as styles from "./Input.css"
import classNames from "utils/classNames"

interface Props {
  name: string
  label: string
  value: string
  error?: string
  type: string
  onChange: (value: string, key: string) => void
}

export default class Input extends React.PureComponent<Props> {
  render() {
    const { label, type, error, value } = this.props
    const errorClasses = classNames({
      [styles.error]: true,
      [styles.hideError]: !error,
    })
    return (
      <div className={styles.container}>
        <label className={styles.label}>{label}</label>
        <input className={styles.input} type={type} value={value} onChange={this.onChangeHandler} />
        <div className={errorClasses}>{error}</div>
      </div>
    )
  }

  onChangeHandler = (event: React.FormEvent<HTMLInputElement>) => this.props.onChange(event.currentTarget.value, this.props.name)
}
