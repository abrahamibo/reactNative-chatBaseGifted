import {View, TouchableOpacity, Image, Text} from "react-native";
import React, {Component} from "react";
import {Composer, Send} from "react-native-gifted-chat";
import styles from "./InputToolbar.style";
import ToolBarMic from "../ToolBarMic/ToolBarMic";

export default class InputToolbar extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { onPickImage, onPickPicture,onMicPlay ,onMicIn, onMicOut, onMic, isEnableMic, recEnd } = this.props;

        return (
            <View style={styles.containerToolBar}>
                {isEnableMic
                    ? <ToolBarMic
                        recEnd={false}
                        onMic={onMic}
                        onMicIn={onMicIn}
                        onMicOut={onMicOut}
                        onMicPlay={onMicPlay}
                        recEnd={recEnd}
                    />
                    : <View style={styles.container}>

                        <TouchableOpacity transparent onPress={onPickImage}>
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
                            <TouchableOpacity transparent onPress={onPickPicture}>
                                <Image source={require('../../../../assets/icon/picture.png')} style={{
                                    width: 32,
                                    height: 32,
                                    marginRight: 10
                                }}/>
                            </TouchableOpacity>
                            <TouchableOpacity transparent onPress={() => onMic('open')}>
                                <Image source={require('../../../../assets/icon/mic.png')} style={{
                                    width: 32,
                                    height: 32,
                                    marginRight: 10
                                }}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                }
            </View>

        )
    }
}