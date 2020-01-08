import {Text, View, TouchableOpacity, Image} from "react-native";
import React, {Component} from "react";
import styles from "../ToolBar/ToolBar.style";
import core from "../../../styles/core.styles";
import {Composer, Send} from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import {
    Ionicons,
    MaterialIcons
} from "@expo/vector-icons";



export default class ToolBar extends Component {

    constructor(props) {
        super(props)
    }
    onMedia = async (type, onState) => {
        let result;
        if (type == 'photo'){
            onState({
                cameraOn: true
            })
        } else if (type == 'image'){
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [4, 3],
                base64: false
            });

            if (!result.cancelled) {
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
            }
        }


    };

    render() {
        const { onSetState } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.toolLeft}>
                    <TouchableOpacity transparent onPress={() => this.onMedia('photo', onSetState)}>
                        <Ionicons name="ios-camera" size={40} color="#1157ff"/>
                    </TouchableOpacity>
                </View>
                <View style={styles.toolInputText}>
                    <Composer {...this.props}/>
                    <Send {...this.props} containerStyle={styles.send}>
                        <Ionicons name="md-send" size={30} color="#1157ff"/>
                    </Send>
                </View>
                <View style={styles.toolRight}>
                    <TouchableOpacity transparent onPress={() => this.onMedia('image', onSetState)}>
                        <Ionicons name="md-images" size={30} color="#1157ff"/>
                    </TouchableOpacity>
                    <TouchableOpacity transparent onPress={() => onSetState({isEnableMic: true})}>
                        <Ionicons name="md-mic" size={30} color="#1157ff"/>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }
}