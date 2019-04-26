import React from "react"
import { Button, Text } from "native-base"
import { NavigationScreenProp, NavigationRoute } from "react-navigation"

interface Props {
  title: string
  route: string
  navigation: NavigationScreenProp<NavigationRoute>
}

export function HeaderRight({ title, route, navigation }: Props) {
  return (
    <Button transparent onPress={React.useCallback(() => navigation.navigate(route), [])}>
      <Text>{title}</Text>
    </Button>
  )
}
