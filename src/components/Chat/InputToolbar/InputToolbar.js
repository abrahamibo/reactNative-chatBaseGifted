import {View, TouchableOpacity, Image, Text} from "react-native";
import React, {Component} from "react";
import {Composer, Send} from "react-native-gifted-chat";
import styles from "./InputToolbar.style";
import ToolBarMic from "../ToolBarMic/ToolBarMic";
import ToolBar from "../ToolBar/ToolBar";

export default class InputToolbar extends Component {

    constructor(props) {
        super(props)
    }


    render() {
        const { onSetState,recording,sound,onSendMedia, onPicture,onMicPlay ,onMicIn, onMicOut, onMic, isEnableMic, recEnd } = this.props;

        return (
            <View style={styles.containerToolBar}>
                {isEnableMic
                    ? <ToolBarMic
                        onMic={onMic}
                        onMicIn={onMicIn}
                        onMicOut={onMicOut}
                        onMicPlay={onMicPlay}
                        onSendMedia={onSendMedia}
                        recEnd={recEnd}
                        onSetState={onSetState}
                        recording={recording}
                        sound={sound}

                    />
                    : <ToolBar
                        {...this.props}
                        onPicture={onPicture}
                        onSetState={onSetState}
                    />

                }
            </View>

        )
    }
}