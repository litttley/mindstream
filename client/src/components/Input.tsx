import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { colors } from "~/guideStyles"

interface Props {
  label: string
  value: string
  error?: string
  type: string
  onChange: (event: React.FormEvent<HTMLInputElement>) => void
}

export function Input({ label, type, error, value, onChange }: Props) {
  return (
    <div className={css(styles.container)}>
      <label className={css(styles.label)}>{label}</label>
      <input className={css(styles.input)} type={type} value={value} onChange={onChange} />
      <div className={css(styles.error, !error ? styles.hideError : undefined)}>{error}</div>
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  container: {
    display: "flex",
    flexDirection: "column",
    minHeight: 65,
    marginBottom: 15,
  },
  label: {
    fontSize: "1rem",
    color: colors.primary,
  },
  input: {
    margin: "3px 0 5px 0",
    paddingBottom: 2,
    border: "none",
    borderBottomWidth: 1,
    borderBottomStyle: "solid",
    borderBottomColor: colors.primary,
    color: colors.primary,
    fontSize: "1.1rem",
    ":focus": {
      borderBottomColor: colors.accent,
    },
    ":invalid": {
      border: "none",
      borderBottomWidth: 1,
      borderBottomStyle: "solid",
      borderBottomColor: colors.error,
    },
  },
  error: {
    fontSize: ".8rem",
    color: colors.error,
  },
  hideError: {
    visibility: "hidden",
  },
})
