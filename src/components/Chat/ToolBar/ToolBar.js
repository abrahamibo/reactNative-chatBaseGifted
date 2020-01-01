import {Text, View, TouchableOpacity, Image} from "react-native";
import React, {Component} from "react";
import styles from "../ToolBar/ToolBar.style";
import core from "../../../styles/core.styles";
import {Composer, Send} from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";



export default class ToolBar extends Component {

    constructor(props) {
        super(props)
    }
    onMedia = async (type, onState) => {
        let result;
        if (type == 'photo'){
            // result = await ImagePicker.launchCameraAsync({
            //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
            //     allowsEditing: true,
            //     aspect: [4, 3],
            // });
            onState({
                cameraOn:true
            })
        } else if (type == 'image'){
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                base64:false
            });

            if (!result.cancelled) {
                console.log(result);
                fetch(result.uri)
                    .then((response) => response.blob())
                    .then((response) => {
                        onState({
                            mediaSource: response,
                            mediaUri: result.uri,
                            mediaType:result.type,
                            modalVisible:true
                        })
                    })
                ;

            }
        }


    };

    render() {
        const { onSetState, onMic } = this.props;

        return (
            <View style={styles.container}>

                <TouchableOpacity transparent onPress={() => this.onMedia('photo', onSetState)}>
                    <Image source={require('../../../../assets/icon/cam.png')} style={{
                        width: 32,
                        height: 32,
                        marginRight: 10
                    }}/>
                </TouchableOpacity>
                <Composer {...this.props} containerStyle={styles.containerInputText} Style={styles.inputText}/>
                <Send
                    {...this.props}
                    label="envoi"
                    // onSend={messages => this.onSend(messages)}
                />
                <View style={{
                    flexDirection:'row',
                    justifyContent:'space-between'
                }}>
                    <TouchableOpacity transparent onPress={() => this.onMedia('image', onSetState)}>
                        <Image source={require('../../../../assets/icon/picture.png')} style={{
                            width: 32,
                            height: 32,
                            marginRight: 10
                        }}/>
                    </TouchableOpacity>
                    <TouchableOpacity transparent onPress={() => onSetState({isEnableMic: true})}>
                        <Image source={require('../../../../assets/icon/mic.png')} style={{
                            width: 32,
                            height: 32,
                            marginRight: 10
                        }}/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}