import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { useIntlMessage } from "~/hooks/useIntlMessage"
import { useFormInput } from "~/hooks/useFormInput"
import { colors } from "~/guideStyles"

interface Props {
  onChange: (value: string) => void
}

export function SearchSourceForm({ onChange }: Props) {
  const queryInput = useFormInput("")
  const message = useIntlMessage()

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    queryInput.onChange(event)
    onChange(event.currentTarget.value)
  }

  return (
    <div className={css(styles.searchSourceForm)}>
      <label className={css(styles.title)}>{message("searchNewRssSources")}</label>
      <div className={css(styles.search)}>
        <input
          value={queryInput.value}
          onChange={handleChange}
          className={css(styles.input)}
          type="search"
          placeholder={message("search")}
        />
      </div>
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  searchSourceForm: {
    display: "flex",
    flexDirection: "column",
    padding: 20,
  },
  title: {
    fontSize: "1.4rem",
    color: colors.primary,
    marginBottom: 10,
  },
  search: {
    display: "flex",
    flexDirection: "row",
  },
  input: {
    flex: 1,
    padding: 10,
    fontSize: "1.4rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.secondary,
  },
  button: {
    fontSize: "1.5rem",
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: colors.secondary,
    color: colors.primary,
    borderLeft: "none",
    backgroundColor: "transparent",
  },
})
