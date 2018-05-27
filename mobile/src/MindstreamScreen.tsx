import * as React from "react"
import { StyleSheet, Text, View, Button } from "react-native"

type Props = {}

export default class MindstreamScreen extends React.Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    MindstreamScreen
                </Text>
                <Button
                    title="RssSources"
                    onPress={() => (this.props as any).navigation.navigate('RssSources')}
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
