import * as React from "react"
import * as styles from "./FormErrors.css"
import { ApiErrors } from "~/models/ApiError"

interface ErrorsProps {
  errors?: ApiErrors
}

export default function FormErrors({ errors }: ErrorsProps) {
  return (
    <div className={styles.errorContainer}>
      <div className={errors && errors.message ? styles.errorMessage : styles.errorMessageHidden}>
        {errors && errors.message || ""}
      </div>
    </div>
  )
}
