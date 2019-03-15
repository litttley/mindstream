import * as React from "react"
import * as styles from "./FormErrors.css"
import { ApiErrors } from "~/models/ApiError"
import { useIntlMessage } from "~/hooks/useIntlMessage"

interface ErrorsProps {
  errors?: ApiErrors
}

export function FormErrors({ errors }: ErrorsProps) {
  const message = useIntlMessage()
  return (
    <div className={styles.errorContainer}>
      <div className={errors && errors.message ? styles.errorMessage : styles.errorMessageHidden}>
        {errors && message(errors.message) || ""}
      </div>
    </div>
  )
}
