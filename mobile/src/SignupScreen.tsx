import React from "react"
import { Container, Content, Form, Button, Item, Input, Label, Text, View } from "native-base"
import { StyleSheet, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"

export function SignupScreen({ navigation }: NavigationScreenProps) {
  return (
    <Container>
      <Content>
        <View>
          <Form>
            <Item floatingLabel>
              <Label>Login</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input />
            </Item>
          </Form>
        </View>
        <View style={styles.actions}>
          <Button block onPress={() => navigation.navigate("Authorized")}>
            <Text>Signup</Text>
          </Button>
        </View>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create<{
  actions: ViewStyle
}>({
  actions: {
    paddingHorizontal: 15,
    marginTop: 30
  }
})
