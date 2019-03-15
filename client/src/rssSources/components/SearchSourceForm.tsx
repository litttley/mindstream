import * as React from "react"
import * as styles from "./SearchSourceForm.css"
import { useIntlMessage } from "~/hooks/useIntlMessage"
import { useFormInput } from "~/hooks/useFormInput"

interface Props {
  onChange: (value: string) => void
}

export function SearchSourceForm({ onChange }: Props) {
  const queryInput = useFormInput("")
  const message = useIntlMessage()
  return (
    <div className={styles.searchSourceForm}>
      <label className={styles.title}>{message("searchNewRssSources")}</label>
      <div className={styles.search}>
        <input
          value={queryInput.value}
          onChange={event => {
            queryInput.onChange(event)
            onChange(event.currentTarget.value)
          }}
          className={styles.input}
          type="search"
          placeholder={message("search")}
        />
      </div>
    </div>
  )
}
