import * as React from "react"
import { StyleSheet, Text, View, Button } from "react-native"

type Props = {}

export default class SignupScreen extends React.Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Signup
                </Text>
                <Button
                    title="Login"
                    onPress={() => (this.props as any).navigation.navigate('Login')}
                />
                <Button
                    title="Back"
                    onPress={() => (this.props as any).navigation.goBack()}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F5FCFF",
    },
})
