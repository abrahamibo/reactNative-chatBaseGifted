import { StyleSheet } from "react-native"


const styles = StyleSheet.create({
    container: {
        width: '100%'
    },
    bottomBar: {
        paddingBottom: true ? 25 : 5,
        backgroundColor: 'transparent',
        alignSelf: 'flex-end',
        justifyContent: 'space-between',
        flex: 0.12,
        width:"100%",
        flexDirection: 'row',
    },
    bottomButton: {
        flex: 0.15,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red'
    },
})

export default styles