import React from "react"
import { NativeBase, Button as NativeBaseButton, Text, Spinner } from "native-base"

interface Props extends NativeBase.Button {
  title: string
  onPress: () => void
  loading: boolean
}

export function Button({ title, onPress, loading, ...props }: Props) {
  return (
    <NativeBaseButton {...props} onPress={onPress}>
      {loading ? <Spinner color="#FFFFFF" /> : <Text>{title}</Text>}
    </NativeBaseButton>
  )
}
