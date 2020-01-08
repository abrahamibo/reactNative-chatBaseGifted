import {Text, View,TouchableOpacity} from "react-native";
import React, {Component} from "react";
// import styles from "../ToolBarMic/ToolBarMic.style";
import core from "../../../styles/core.styles";
import {Audio} from "expo-av";



export default class ToolBarMic extends Component {

    constructor(props) {
        super(props)
    }

    handlePressMic = async (status, setState) => {
        if (status === "close") {
            setState({
                isEnableMic: false,
                recording:null,
                recEnd:false
            })
        } else if (status === "valider") {
            this.props.onSendMedia(null,'audio');
            setState({
                isEnableMic: false,
                recording:null,
                recEnd:false
            })
        }
    }
    handlePressMicIn = async (setState) => {

        try {
            const recording = new Audio.Recording();

            let prepare = await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            setState({
                recording:recording,
            });

            // You are now recording!
        } catch (error) {
            // An error occurred!
            console.log(error);
        }
    };
    handlePressMicOut = async (setState) => {
        let result = await this.props.recording.stopAndUnloadAsync();
        let url = await this.props.recording.getURI();
        fetch(url)
            .then((response) => response.blob())
            .then((response) => {
                setState({
                    mediaSource: response,
                    mediaUri: url,
                    recEnd:true
                });
            })
        ;

    };
    handlePressMicPlay = async (onPlayAudio) => {
        let status = await this.props.sound.getStatusAsync();
        let url = await this.props.recording.getURI();
        console.log(url);
        onPlayAudio(url)


    }


    render() {
        const { onSetState, recEnd, onPlayAudio } = this.props;

        return (
            <View style={{
            maxHeight: "20%",
            height:'100%',
            flexDirection:'row',
            alignItems:'center',
            backgroundColor: core.colors.black,
            shadowColor: core.colors.white,
            shadowOffset: {
                width: 0,
                height: 0
            },
            shadowRadius: 3,
            shadowOpacity: 1,
            paddingLeft: 15,
            paddingRight: 15,
            paddingTop:7,
            paddingBottom:7
        }}>
            <TouchableOpacity transparent
                              onPress={() => this.handlePressMic('close',onSetState)}
                              style={{backgroundColor:core.colors.redDegradEnd, marginRight: 20}}>
                <Text>
                    quitter
                </Text>
            </TouchableOpacity>
            <TouchableOpacity transparent
                              onPressIn={() => this.handlePressMicIn(onSetState)}
                              onPressOut={() => this.handlePressMicOut(onSetState)}
                              style={{marginRight: 20}}>
                <Text>
                    rec
                </Text>
            </TouchableOpacity>
            {recEnd &&
                <View style={{flexDirection: 'row', alignItems:'center'}}>
                    <TouchableOpacity transparent
                                      onPress={() => this.handlePressMicPlay(onPlayAudio)}
                                      style={{marginRight: 18}}>
                        <Text>
                            plays
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity transparent
                                      onPress={() => this.handlePressMic('valider', onSetState)}
                                      style={{marginRight: 18}}>
                        <Text>
                            valider
                        </Text>
                    </TouchableOpacity>
                </View>

            }

        </View>)
    }
}