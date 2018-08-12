import { object, string } from "validation.ts"
import { UserValidator } from "models/User"

export const AuthResponseValidator = object({
  token: string,
  user: UserValidator,
})

export type AuthResponse = typeof AuthResponseValidator.T
