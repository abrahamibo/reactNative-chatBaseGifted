import { StyleSheet } from "react-native"


const styles = StyleSheet.create({
    container: {
        paddingBottom: true ? 25 : 5,
        backgroundColor: 'transparent',
        alignSelf: 'flex-end',
        justifyContent: 'space-around',
        alignItems: 'center',
        flex: 0.12,
        width:"100%",
        flexDirection: 'row',
    },
    buttonsCenterContaint: {
        flexDirection:'row',
        justifyContent:"space-around",
        height: 58,
        flex: 0.5,
    },
    bottomRL: {
        flex: 0.15,
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonTake : {
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 20,
        marginLeft: 20
    },
    buttonRec : {
        height: 58,
        justifyContent: 'center',
        alignItems: 'center',
    }
})

export default styles