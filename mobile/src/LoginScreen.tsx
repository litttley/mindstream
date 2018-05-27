import * as React from "react"
import { StyleSheet, Text, View, Button } from "react-native"

type Props = {}

export default class LoginScreen extends React.Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    Login
                </Text>
                <Button
                    title="Signup"
                    onPress={() => (this.props as any).navigation.navigate('Signup')}
                />
                <Button
                    title="Back"
                    onPress={() => (this.props as any).navigation.goBack()}
                />
                <Button
                    title="Home"
                    onPress={() => (this.props as any).navigation.navigate('Home')}
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
