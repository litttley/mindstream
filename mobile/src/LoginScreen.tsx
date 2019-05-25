import React from "react"
import { Container, Content, Form, Item, Input, Label, Text, View, Spinner } from "native-base"
import { StyleSheet, ViewStyle } from "react-native"
import { NavigationScreenProps } from "react-navigation"
import { Button } from "./Button"
import { api } from "./Api"

export function LoginScreen({ navigation }: NavigationScreenProps) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [loading, setLoading] = React.useState(false)

  console.log("LoginScreen", email)

  const onPress = () => {
    setLoading(true)
    api
      .login(email, password)
      .then(result => {
        setLoading(false)
        console.log("LoginScreen", result)
        //navigation.navigate("Authorized")
      })
      .catch(error => {
        setLoading(false)
        console.log("LoginScreen error", error)
      })
  }

  return (
    <Container>
      <Content>
        <View>
          <Form>
            <Item floatingLabel>
              <Label>Email</Label>
              <Input value={email} onChangeText={setEmail} />
            </Item>
            <Item floatingLabel>
              <Label>Password</Label>
              <Input value={password} secureTextEntry onChangeText={setPassword} />
            </Item>
          </Form>
        </View>
        <View style={styles.actions}>
          <Button title="Login" block onPress={onPress} disabled={loading} loading={loading} />
        </View>
      </Content>
    </Container>
  )
}

const styles = StyleSheet.create<{ actions: ViewStyle }>({
  actions: {
    paddingHorizontal: 15,
    marginTop: 30
  }
})
