import * as React from "react"

export function useFormInput(initialValue: string) {
  const [value, setValue] = React.useState(initialValue)

  // TODO remove React.FormEvent<HTMLInputElement> |
  function onChange(
    event:
      | React.FormEvent<HTMLInputElement>
      | React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement | HTMLSelectElement>
  ) {
    setValue(event.currentTarget.value)
  }

  return { value, onChange }
}
