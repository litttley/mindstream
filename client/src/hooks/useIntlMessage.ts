import * as React from "react"
import IntlMessageFormat from "intl-messageformat"
import { IntlContext } from "~/intl/IntlContext"

export function useIntlMessage(key: string, value?: unknown) {
  const constext = React.useContext(IntlContext)
  if (!constext.messages[constext.local][key]) {
    console.error(`Intl: key not found ${key}`)
  }
  return new IntlMessageFormat(constext.messages[constext.local][key], constext.local).format(value)
}
