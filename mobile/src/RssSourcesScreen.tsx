import * as React from "react"
import { StyleSheet, Text, View, Button } from "react-native"

type Props = {}

export default class RssSourcesScreen extends React.Component<Props> {
    render() {
        return (
            <View style={styles.container}>
                <Text>
                    RssSources
                </Text>
                <Button
                    title="Mindstream"
                    onPress={() => (this.props as any).navigation.navigate('Mindstream')}
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
