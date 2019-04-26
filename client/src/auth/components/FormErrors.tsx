import * as React from "react"
import { StyleSheet, css, CSSProperties } from "aphrodite/no-important"

import { colors } from "~/guideStyles"
import { ApiErrors } from "~/models/apiError"
import { useIntlMessage } from "~/hooks/useIntlMessage"

interface ErrorsProps {
  errors?: ApiErrors
}

export function FormErrors({ errors }: ErrorsProps) {
  const message = useIntlMessage()

  return (
    <div className={css(styles.errorContainer)}>
      <div className={css(errors && errors.message ? styles.errorMessage : styles.errorMessageHidden)}>
        {errors && message(errors.message) || ""}
      </div>
    </div>
  )
}

const styles = StyleSheet.create<Record<string, CSSProperties>>({
  errorContainer: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "40px",
    padding: "24px 0",
  },
  errorMessage: {
    color: colors.error,
  },
  errorMessageHidden: {
    visibility: "hidden",
  },
})
