import React from "react"
import { NavigationScreenProps } from "react-navigation"
import { Container, Content, Button, Text } from "native-base"

export function HomeScreen({ navigation }: NavigationScreenProps) {
  return (
    <Container>
      <Content>
        <Button onPress={() => navigation.navigate("Auth") }>
          <Text>Mindstream</Text>
        </Button>
      </Content>
    </Container>
  )
}
