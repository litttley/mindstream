import React from "react"
import { createAppContainer, createSwitchNavigator, createStackNavigator, NavigationScreenConfigProps } from "react-navigation"
import { LoginScreen } from "./LoginScreen"
import { HomeScreen } from "./HomeScreen"
import { SignupScreen } from "./SignupScreen"
import { HeaderRight } from "./HeaderRight"

const AuthorizedNavigator = createStackNavigator({
  Home: {
    screen: HomeScreen,
    navigationOptions: {
      title: "Mindstream",
    },
  },
})

const AuthNavigator = createStackNavigator({
  Login: {
    screen: LoginScreen,
    navigationOptions: ({ navigation }: NavigationScreenConfigProps) => ({
      title: "Login",
      headerRight: <HeaderRight title="Signup" route="Signup" navigation={navigation} />,
    }),
  },
  Signup: {
    screen: SignupScreen,
    navigationOptions: {
      title: "Signup",
    },
  },
})

const AppNavigator = createSwitchNavigator({
  Authorized: AuthorizedNavigator,
  Auth: AuthNavigator,
}, {
  initialRouteName: "Auth",
})

export const App = createAppContainer(AppNavigator)
