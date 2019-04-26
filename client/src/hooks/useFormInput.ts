import * as React from "react"

export function useFormInput(initialValue: string) {
  const [value, setValue] = React.useState(initialValue)

  function onChange(event: React.FormEvent<HTMLInputElement>) {
    setValue(event.currentTarget.value)
  }

  return { value, onChange }
}
