import { object, string, number, optional, dictionary, array, union } from "validation.ts"
import { InjectedIntl } from "react-intl"

export const ApiErrorValidator = object({
  code: string,
  message: string,
  params: dictionary(string, union(string, number))
})
export type ApiError = typeof ApiErrorValidator.T

export const ApiErrorsValidator = object({
  message: string,
  errors: optional(dictionary(string, array(ApiErrorValidator)))
})

export type ApiErrors = typeof ApiErrorsValidator.T

export function getFieldErrorMessage(field: string, intl: InjectedIntl, errors?: ApiErrors): string | undefined {
  if (errors) {
    const fieldsErrors = errors.errors && errors.errors[field] as ApiError[] | undefined
    if (fieldsErrors && fieldsErrors.length > 0) {
      const error = fieldsErrors[0]
      return intl.formatMessage({ id: error.message }, error.params)
    }
  }
}
