import React, {Component, useState} from 'react'
import {Bubble, GiftedChat} from 'react-native-gifted-chat'
import {Image, KeyboardAvoidingView, Text, View,TouchableOpacity} from "react-native";
import * as Permissions from "expo-permissions";
import {Audio, Video} from 'expo-av';

import {ModalMedia} from "../../components/Chat/ModalMedia/ModalMedia";
import SafeAreaView from 'react-native-safe-area-view';
import messages from "./messageFake";
import CameraScene from "../../components/Chat/Camera/CameraScene/CameraScene";
import ToolBarMic from "../../components/Chat/ToolBarMic/ToolBarMic";
import ToolBar from "../../components/Chat/ToolBar/ToolBar";
import styles from "./ChatScreen.style";
import User from "../../store/model/User";
import Message from "../../store/model/Message";

import firebaseApp from '../../network/firebase';
// import auth, { firebase } from '@react-native-firebase/auth';


Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    interruptionModeIOS:Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
    playsInSilentModeIOS:true,
    staysActiveInBackground:false,
    interruptionModeAndroid:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    shouldDuckAndroid:true,
    playThroughEarpieceAndroid:false
});

export default class ChatScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            modalVisible: false,
            mediaSource: null,
            mediaUri: null,
            mediaType: null,
            isEnableMic: false,
            loadUpload: false,
            recording: null,
            audioSource: null,
            audioUri: null,
            sound: new Audio.Sound(),
            playAudio: false,
            progress: 0,
            size: 70,
            recEnd: false,
            cameraOn: false,
            user: new User({_id: 5,
                name:"black",
                avatar: 'https://placeimg.com/140/140/any'
            })
        };
    }

    componentDidMount() {
        this.setState({
            messages: messages,
        })
        this.getCameraPermissionAsync();
        this.getAudioRecordPermissionAsync();
    }
    getAudioRecordPermissionAsync = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({
            haveRecordingPermissions: response.status === 'granted',
        });
    };
    getCameraPermissionAsync = async () => {
        // if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            // }
        }
    };



    renderInputToolbar = props => <ToolBar {...props} onSetState={this.onSetState} />
    renderMessageVideo = (props) => {
        let i=0,
            ii=0;
        return !props.currentMessage.video ? (
            <View />
        ) : (

            <Video
                source={{ uri: props.currentMessage.video }}
                rate={1.0}
                volume={1.0}
                isMuted={false}
                resizeMode="cover"
                useNativeControls={true}
                style={{ width: 100, height: 100 }}
            />
        );
    };
    renderName = props => {
        // const { user: self } = this.props; // where your user data is stored;
        // const { user = {} } = props.currentMessage;
        // const { user: pUser = {} } = props.previousMessage;
        // const isSameUser = pUser._id === user._id;
        // const isSelf = user._id === self._Id;
        // const shouldNotRenderName = isSameUser;
        const shouldNotRenderName = true;
        // let firstName = user.name.split(" ")[0];
        // let lastName = user.name.split(" ")[1][0];
        return shouldNotRenderName ? (
            <View />
        ) : (
            <View>
                <Text style={{ color: "grey", padding: 2, alignSelf: "center" }}>
                    {/*{`${firstName} ${lastName}.`}*/}
                    test test
                </Text>
            </View>
        );
    };
    renderAudio = (props) => {
        const { currentMessage } = props;
        return !currentMessage.audio ? (
            <View />
        ) : (
            <View style={{padding:10}}>
                <TouchableOpacity transparent onPress={() => this.handlePressPlayAudio(currentMessage.audio)}>
                    <Text>plays</Text>
                </TouchableOpacity>
            </View>

        );
    };
    renderBubble = props => {
        return (
            <View>
                {this.renderName(props)}
                {this.renderAudio(props)}
                <Bubble {...props} />
                {/*<Bubble {...props} renderCustomView={this.renderAudio} />*/}
            </View>
        );
    };

    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }
    onSendMedia = (text, type) => {
        console.log(this.state.mediaUri);
        let message = new Message({
            user: {
                _id: 5,
                name: "black",
                avatar: () => (
                    <Image
                        style={{
                            width: 20,
                            height: 20,
                            marginRight: 10.2
                        }}
                        source={require('../../../assets/icon/search.png')}
                    />
                ),
            },

        });
        console.log(message);
        if (text){
            message.text= text
        }
        switch (type) {
            case 'image':
                message.image = this.state.mediaUri;
                break;
            case 'audio':
                message.audio = this.state.mediaUri;
                break;
            case 'video':
                message.video = this.state.mediaUri;
                break;
        }
        let messages = [message];

        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
            mediaSource:null,
            mediaUri:null,
            modalVisible:false,
            loadUpload: false
        }))
    };
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
                    this.state.sound.stopAsync();
                    this.state.sound.unloadAsync();
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
    onSetState = ( states) => {
        this.setState(states)
    }

    handlePressPlayAudio = async (url) => {
        this.setState({
            playAudio: true
        });
        let status = await this.state.sound.getStatusAsync();

        if (status.isLoaded){
            await this.state.sound.stopAsync();
            await this.state.sound.unloadAsync();
        }
        console.log(url);
        await this.state.sound.loadAsync({uri:url});
        this.state.sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);

        try {
            await this.state.sound.playAsync();
            this.setState({ playAudio: false });
        } catch (error) {
            // An error occurred!
        }
    }


    // async register(email, password) {
    //     try {
    //          firebase.auth().createUserWithEmailAndPassword(email, password)
    //             .then(app => alert(app));
    //
    //
    //     } catch (e) {
    //         console.error(e.message);
    //     }
    // }

    render() {
        return (
            <SafeAreaView forceInset={{top: "always",bottom:"always"}} style={{ flex: 1}}>
                <ModalMedia
                    modalVisible={this.state.modalVisible}
                    mediaUri={this.state.mediaUri}
                    mediaType={this.state.mediaType}
                    onSendMedia={this.onSendMedia}
                    onSetState={this.onSetState}
                    loadUpload={this.state.loadUpload}
                />

                {this.state.cameraOn
                    ?
                    <CameraScene onSetState={this.onSetState}/>
                    :
                    <KeyboardAvoidingView
                        style={styles.container}
                        contentContainerStyle={styles.contentContainer}
                    >
                        <GiftedChat
                            messages={this.state.messages}
                            onSend={messages => this.onSend(messages)}
                            renderInputToolbar={this.renderInputToolbar}
                            renderBubble={this.renderBubble}
                            maxComposerHeight={50}
                            renderMessageVideo={this.renderMessageVideo}
                            user={{
                                _id: 5,
                                name:"black",
                                avatar: 'https://placeimg.com/140/140/any'
                                // avatar: () => {
                                //     return (<Image
                                //     style={{
                                //         width: 20,
                                //         height: 20,
                                //     }}
                                //     source={require('../../../assets/icon/search.png')}
                                // />)},
                            }}
                            locale="fr"
                        />
                        {this.state.isEnableMic &&

                        <ToolBarMic
                            onSendMedia={this.onSendMedia}
                            recording={this.state.recording}
                            sound={this.state.sound}
                            recEnd={this.state.recEnd}
                            onSetState={this.onSetState}
                            onPlayAudio={this.handlePressPlayAudio}
                        />
                        }
                    </KeyboardAvoidingView>
                }
                <TouchableOpacity onPress={() => this.register("ibo",'123456789')}>
                    <Text>tes connecnt</Text>
                </TouchableOpacity>

            </SafeAreaView>

        )
    }
}

