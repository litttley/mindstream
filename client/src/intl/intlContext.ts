import * as React from "react"
import { messagesEn } from "./messagesEn"

const messages: Record<string, Record<string, string>> = {
  en: messagesEn
}

const local = "en"

export interface IntlContextType {
  local: "en" | "fr"
  messages: Record<string, Record<string, string>>
}

export const intlContextInitialValues: IntlContextType = { messages, local }

export const IntlContext = React.createContext(intlContextInitialValues)
