import { object, string } from "validation.ts"

export const UserValidator = object({
    uuid: string,
    email: string,
    login: string,
    updated: string,
})

export type User = typeof UserValidator.T
