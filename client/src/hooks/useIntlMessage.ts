import * as React from "react"
import MessageFormat from "intl-messageformat"
import { IntlContext } from "~/intl/intlContext"

export type MessageParams = Record<string, string | number | boolean | null | undefined>

export function useIntlMessage() {
  const constext = React.useContext(IntlContext)

  return (key: string, params?: MessageParams) => {
    if (!constext.messages[constext.local][key]) {
      console.error(`Intl: key not found ${key}`)
    }

    return new MessageFormat(constext.messages[constext.local][key], constext.local).format(params)
  }
}
