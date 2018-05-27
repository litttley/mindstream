import * as React from "react"
import { createStackNavigator, createSwitchNavigator } from "react-navigation"
import SignupScreen from "./SignupScreen"
import LoginScreen from "./LoginScreen"
import MindstreamScreen from "./MindstreamScreen"
import RssSourcesScreen from "./RssSourcesScreen"

const HomeStack = createStackNavigator({
    Mindstream: {
        screen: MindstreamScreen,
        navigationOptions: {
            title: "Mindstream"
        }
    },
    RssSources: {
        screen: RssSourcesScreen,
        navigationOptions: {
            title: "RssSources"
        }
    }
})

const AuthStack = createStackNavigator({
    Login: {
        screen: LoginScreen,
        navigationOptions: {
            title: "Login"
        }
    },
    Signup: {
        screen: SignupScreen,
        navigationOptions: {
            title: "Signup"
        }
    },
})

const SwitchNavigator = createSwitchNavigator({
    Auth: AuthStack,
    Home: HomeStack,
})

export default class App extends React.Component {
    render() {
        return (
            <SwitchNavigator />
        )
    }
}
