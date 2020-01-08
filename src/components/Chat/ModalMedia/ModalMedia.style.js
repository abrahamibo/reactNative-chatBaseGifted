import { StyleSheet } from "react-native"
import core from "../../../styles/core.styles";


const styles = StyleSheet.create({
    styelcontainer:{
        flex: 1,
        backgroundColor: '#232323',
        alignItems:'center',
        justifyContent:'center'
    },
    buttonBack: {
        position: 'absolute',
        left: 15,
        top: 0,
        zIndex: 999
    },
    image: {
        height: "100%",
        width: "100%",
        maxWidth: 'auto',
        maxHeight: 'auto'
    },
    imageBackground: {
        height: "100%",
        width: "100%",
        maxWidth: 'auto',
        maxHeight: 'auto'
    },
    video: {
        width: 300,
        height: 300
    },
    inputTextContainer:{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent:'center',
        width: '90%',
        height: 'auto',
        minHeight: 50,
        borderRadius: 12,
        borderWidth: 1,
        paddingLeft:10,
        paddingRight:10,
        borderColor: core.colors.white,
        backgroundColor: core.colors.white,
        position: 'absolute',
        bottom: 10,
        zIndex:999
    },
    inputText:{
        width: '80%',
        minHeight: 50,
    }

})

export default styles
