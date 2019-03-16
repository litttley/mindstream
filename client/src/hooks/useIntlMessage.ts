import * as React from "react"
import IntlMessageFormat from "intl-messageformat"
import { IntlContext } from "~/intl/IntlContext"

export function useIntlMessage() {
  const constext = React.useContext(IntlContext)

  return (key: string, params?: unknown) => {
    if (!constext.messages[constext.local][key]) {
      console.error(`Intl: key not found ${key}`)
    }

    return new IntlMessageFormat(constext.messages[constext.local][key], constext.local).format(params)
  }
}
