import { StyleSheet } from "react-native"
import core from "../../../../styles/core.styles";


const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: 90,
        left: 30,
        width: 200,
        height: 160,
        backgroundColor: '#000000BA',
        borderRadius: 4,
        padding: 10,
    },
    pictureQualityLabel: {
        fontSize: 10,
        marginVertical: 3,
        color: 'white'
    },
    pictureSizeContainer: {
        flex: 0.5,
        alignItems: 'center',
        paddingTop: 10,
    },
    pictureSizeChooser: {
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row'
    },
    pictureSizeChooserDirection: {
       padding: 5,
    },

    pictureSizeLabel: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default styles