import {Text, View,TouchableOpacity} from "react-native";
import React, {Component} from "react";
// import styles from "../ToolBarMic/ToolBarMic.style";
import core from "../../../styles/core.styles";
import {Audio} from "expo-av";



export default class ToolBarMic extends Component {

    constructor(props) {
        super(props)
    }

    onMic = async (status, setState) => {
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
    onMicIn = async (setState) => {

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
    onMicOut = async (setState) => {
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
    onMicPlay = async (setState) => {
        let status = await this.props.sound.getStatusAsync();
        let url = await this.props.recording.getURI();

        if (status.isLoaded){

            await this.props.sound.unloadAsync();
        }
        await this.props.sound.loadAsync({uri:url});
        // console.log(this.state.sound,'lllllll');
        this.props.sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);
        // soundObject.setStatusAsync()

        try {
            await this.props.sound.playAsync();

            // console.log(status);
            setState({ playAudio: false });
            // Your sound is playing!
        } catch (error) {
            // An error occurred!
        }
    }
    onPlaybackStatusUpdate = playbackStatus => {

        if (!playbackStatus.isLoaded) {
            // Update your UI for the unloaded state
            if (playbackStatus.error) {
                console.log(`Encountered a fatal error during playback: ${playbackStatus.error}`);
                // Send Expo team the error on Slack or the forums so we can help you debug!
            }
        } else {
            // Update your UI for the loaded state
            let i = playbackStatus.durationMillis;
            let ii = playbackStatus.positionMillis;


            if (playbackStatus.isPlaying) {
                // Update your UI for the playing state

                console.log(playbackStatus);
                console.log(i,'playbackStatus.durationMillis');
                console.log(ii,'playbackStatus.positionMillis');

                // console.log(e);
                this.setState({
                    progress: ii
                });
            } else {
                if (i == ii){
                    console.log(i,'---playbackStatus.durationMillis');
                    console.log(ii,'---playbackStatus.positionMillis');
                    // playbackStatus.shouldPlay = false;
                    // this.state.sound.setStatusAsync(playbackStatus);
                    this.props.sound.stopAsync();
                    this.props.sound.unloadAsync();
                }
            }

            if (playbackStatus.isBuffering) {
                // Update your UI for the buffering state
            }

            if (playbackStatus.didJustFinish && !playbackStatus.isLooping) {
                // The player has just finished playing and will stop. Maybe you want to play something else?
            }
        }
    };


    render() {
        const { onSetState, recEnd, onMic, onMicIn, onMicOut, onMicPlay } = this.props;

        return (<View style={{
            minHeight: 44,
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
                              onPress={() => this.onMic('close',onSetState)}
                              style={{backgroundColor:core.colors.redDegradEnd,marginRight: 20}}>
                <Text>
                    quitter
                </Text>
            </TouchableOpacity>
            <TouchableOpacity transparent
                              onPressIn={() => this.onMicIn(onSetState)}
                              onPressOut={() => this.onMicOut(onSetState)}
                              style={{marginRight: 20}}>
                <Text>
                    rec
                </Text>
            </TouchableOpacity>
            {recEnd
                ?
                <View style={{flexDirection: 'row', alignItems:'center'}}>
                    <TouchableOpacity transparent
                                      onPress={() => this.onMicPlay(onSetState)}
                                      style={{marginRight: 18}}>
                        <Text>
                            plays
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity transparent
                                      onPress={() => this.onMic('valider', onSetState)}
                                      style={{marginRight: 18}}>
                        <Text>
                            valider
                        </Text>
                    </TouchableOpacity>
                </View>
                :
                null
            }

        </View>)
    }
}