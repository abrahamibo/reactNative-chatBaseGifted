import { StyleSheet } from "react-native"
import core from "../../../styles/core.styles";


const styles = StyleSheet.create({
    container:{
        minHeight: 44,
        height:'auto',
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-around',
        backgroundColor: core.colors.white,
        shadowColor: core.colors.white,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 3,
        shadowOpacity: 1,
        paddingLeft: 0,
        paddingRight: 0,
        paddingTop:7,
        paddingBottom:7
    },
    toolInputText: {
        flexDirection:'row',
        alignItems:'center',
        justifyContent: "space-around",
        textAlign:'center',
        width:"60%",
        borderColor:'#1157ff',
        borderWidth:1,
        borderRadius:20,
        paddingLeft:5,
        paddingRight:5
    },
    send:{
        justifyContent: "center",
    },
    containerInputText: {
        borderTopWidth: 1.5,
        borderTopColor: '#333',
        backgroundColor: 'red'
    },
    inputText: {
        width: 150,
        height:'auto',
        borderTopColor: '#333',
        backgroundColor: 'red'
    },
    toolRight:{
        flexDirection:'row',
        justifyContent:'space-between',
        width:"20%"
    },
    toolLeft:{
        flexDirection:'row',
        justifyContent:'space-between',
        // width:"20%"
    }
})

export default styles