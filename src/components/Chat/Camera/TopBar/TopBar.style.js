import {
    StatusBar,
    StyleSheet
} from "react-native"
import core from "../../../../styles/core.styles";


const styles = StyleSheet.create({
    container: {
        flex: 0.2,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        justifyContent: 'space-around',
        paddingTop: StatusBar.currentHeight / 2,
    },
    toggleButton: {
        flex: 0.25,
        height: 40,
        marginHorizontal: 2,
        marginBottom: 10,
        marginTop: 20,
        padding: 5,
        alignItems: 'center',
        justifyContent: 'center',
    }
})

export default styles