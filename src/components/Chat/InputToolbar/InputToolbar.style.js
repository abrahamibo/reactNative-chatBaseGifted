import { StyleSheet } from "react-native"
import core from "../../../styles/core.styles";


const styles = StyleSheet.create({
    containerToolBar:{
        flex:1,
        justifyContent:'center',
        backgroundColor: core.colors.white,
        shadowColor: core.colors.white,
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowRadius: 3,
        shadowOpacity: 1,
        // paddingLeft: 15,
        // paddingRight: 15,
        // paddingTop:7,
        // paddingBottom:7
    }
})

export default styles