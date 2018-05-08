import { object, string, number, optional, dictionary, array, union } from "validation.ts"

export const ApiErrorValidator = object({
  message: string,
  errors: optional(dictionary(string, array(object({
      code: string,
      message: string,
      params: dictionary(string, union(string, number))
  }))))
})

export type ApiError = typeof ApiErrorValidator.T
