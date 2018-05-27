import * as React from "react"
import { StyleSheet, Text, View } from "react-native"

type Props = {}

export default class HomePage extends React.Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    HomePage
                </Text>
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
