import { MessageParams } from "~/hooks/useIntlMessage"

export interface ApiError {
  code: string
  message: string
  params: Record<string, string | number>
}
export interface ApiErrors {
  message: string
  errors?: Record<string, ApiError[]>
}

export function getFieldErrorMessage(
  field: string,
  intl: (key: string, params?: MessageParams) => string,
  errors?: ApiErrors
): string | undefined {
  if (errors) {
    const fieldsErrors = errors.errors && (errors.errors[field] as ApiError[] | undefined)
    if (fieldsErrors && fieldsErrors.length > 0) {
      const error = fieldsErrors[0]

      return intl(error.message, error.params)
    } else {
      return undefined
    }
  } else {
    return undefined
  }
}
