import React, {Component} from 'react'
import {Bubble, Composer, GiftedChat, Send} from 'react-native-gifted-chat'
import {Image, KeyboardAvoidingView, Text, View,TouchableOpacity} from "react-native";
import InputToolbar from "../Chat/InputToolbar/InputToolbar";
import colors from "../../styles/core/colors.styles";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {Audio, Video} from 'expo-av';

import {DisplayModalImage} from "../Chat/ModalImage/ModalImage";
import SafeAreaView from 'react-native-safe-area-view';
import moment from "moment";
import uuid from "uuid/v4";
import messages from "./messageFake";

Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    interruptionModeIOS:Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
    playsInSilentModeIOS:true,
    staysActiveInBackground:false,
    interruptionModeAndroid:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
    shouldDuckAndroid:true,
    playThroughEarpieceAndroid:false
});
export default class ChatScene extends Component {
    constructor(props) {
        super(props);
        this.state = {
            messages: [],
            modalVisible:false,
            imgSource:null,
            imageUri:null,
            isEnableMic: false,
            loadUpload:false,
            recording:null,
            audioSource:null,
            audioUri:null,
            sound:new Audio.Sound(),
            playAudio:false,
            progress:0,
            size:70,
            recEnd:false
        };
    }

    componentDidMount() {
        this.setState({
            messages: messages,
        })
        this._askForPermissions();
        this.getPermissionAsync();
    }
    _askForPermissions = async () => {
        const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
        this.setState({
            haveRecordingPermissions: response.status === 'granted',
        });
    };
    getPermissionAsync = async () => {
        // if (Constants.platform.ios) {
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            // }
        }
    };


    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }
    _pickImage = async (type) => {
        let result;
        if (type == 'photo'){
            result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
            });
        } else if (type == 'image'){
            result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                base64:true
            });
        }

        if (!result.cancelled) {

            fetch(result.uri)
                .then((response) => response.blob())
                .then((response) => {
                    this.setState({
                        imgSource: response,
                        imageUri: result.uri,
                        modalVisible:true
                    });
                })
            ;

        }
    };
    _mic = async (type) => {
        if (type === "open") {
            this.setState({
                isEnableMic: true,
            });
        } else if (type === "close") {
            this.setState({
                isEnableMic: false,
                recording:null,
                recEnd:false
            })
        } else if (type === "valider") {
            this.onSendAudio('test');
            this.setState({
                isEnableMic: false,
                recording:null,
                recEnd:false
            })
        }
    }

    _MicIn = async (type) => {

        try {
            const recording = new Audio.Recording();

            let prepare = await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
            await recording.startAsync();
            this.setState({
                recording:recording,
            });

            // You are now recording!
        } catch (error) {
            // An error occurred!
            console.log(error);
        }
    };
    _MicOut = async (type) => {
       let result = await this.state.recording.stopAndUnloadAsync();
        let url = await this.state.recording.getURI();
        // console.log(url,'urlurl');
        // console.log(result,'urlurl');
        fetch(url)
            .then((response) => response.blob())
            .then((response) => {
                this.setState({
                    audioSource: response,
                    audioUri: url,
                    recEnd:true
                });
                // this.uploadAudio('ok')
            })
        ;

    };
    _MicPlay = async () => {
        let url = await this.state.recording.getURI();
        try {
            const soundObject = new Audio.Sound();
            // await soundObject.loadAsync({uri:url});
            await soundObject.loadAsync({uri:url});
            await soundObject.playAsync();
            this.setState({ playAudio: false });
            // const { sound: soundObject, status } = await Audio.Sound.createAsync(
            //     {uri:url},
            //     { shouldPlay: true }
            // );
            // Your sound is playing!
        } catch (error) {
            // An error occurred!
        }
    };


    renderInputToolbar = props => <InputToolbar {...props}
                                                onPickImage={() => this._pickImage('photo')}
                                                onPickPicture={() => this._pickImage('image')}
                                                onMic={this._mic}
                                                onMicOut={this._MicOut}
                                                onMicIn={this._MicIn}
                                                onMicPlay={this._MicPlay}
                                                isEnableMic={this.state.isEnableMic}
                                                recEnd={this.state.recEnd}


    />
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
                isLooping
                style={{ width: 300, height: 300 }}
            />
        );
    };
    /* renderInputToolbar2 = props => {
         //Add the extra styles via containerStyle
         if (this.state.isEnableMic){
             return (
                 <View style={{
                     minHeight: 70,
                     height:'auto',
                     alignItems:'center',
                     flexDirection:'row',
                     backgroundColor: Colors.white,
                     shadowColor: Colors.black1,
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
                     <Button transparent
                             onPress={() => this._enabledMic(false)}
                             style={{marginRight: 20}}>
                         <Text>
                             quitter
                         </Text>
                     </Button>
                     <Button transparent
                             onPressIn={this._MicIn}
                             onPressOut={this._MicOut}
                             style={{marginRight: 20}}>
                         <Text>
                             rec
                         </Text>
                     </Button>
                     {this.state.recEnd
                         ?
                         <View style={{flexDirection: 'row', alignItems:'center'}}>
                             <Button transparent
                                     onPress={this._MicPlay}
                                     style={{marginRight: 18}}>
                                 <Text>
                                     plays
                                 </Text>
                             </Button>
                             <Button transparent
                                     onPress={() => this.uploadAudio()}
                                     style={{marginRight: 18}}>
                                 <Text>
                                     valider
                                 </Text>
                             </Button>
                         </View>
                         :
                         null
                     }

                 </View>
             )
         }else {
             return (
                 <View style={{
                     minHeight: 47,
                     height:'auto',
                     flexDirection:'row',
                     alignItems:'center',
                     backgroundColor: Colors.white,
                     shadowColor: Colors.black1,
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
                     <Button transparent onPress={() => this._pickImage('photo')}>
                         <Image source={require('../assets/icon/chats-camera.png')} style={{width:32, height:32, marginRight: 10}}/>
                     </Button>
                     {/!*<TextInput style={{minWidth:20,height:'auto', borderTopWidth: 1.5, borderTopColor: '#333', backgroundColor:'blue'}}/>*!/}
                     <Composer {...props} containerStyle={{borderTopWidth: 1.5, borderTopColor: '#333', backgroundColor:'red'}} Style={{width:150, borderTopColor: '#333', backgroundColor:'red'}} />
                     <Send
                         {...props}
                         label="envoi"
                         // onSend={messages => this.onSend(messages)}
                     />
                     <View style={{height:'auto',flexDirection:'row',alignItems:'center'}}>
                         <Button transparent onPress={() => this._enabledMic(true)} style={{marginRight: 18}}>
                             <Image source={require('../assets/icon/chats-micro.png')} style={{width:20, height:20}}/>
                         </Button>
                         <Button transparent onPress={() => this._pickImage('image')}>
                             <Image source={require('../assets/icon/chats-pictures.png')} style={{width:20, height:20}}/>
                         </Button>
                     </View>
                 </View>
             )
         }
     };*/
    onSendImage = (text) => {
        let message = {
            _id: uuid(),
            createdAt: new Date(),
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
            image: this.state.imageUri,
        };
        if (text){
            message.text= text
        }
        message.add = moment(message.createdAt).format('LLLL');
        message.add = moment(message.createdAt).format('LLLL');
        let messages = [message];
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
            imgSource:null,
            imageUri:null,
            modalVisible:false,
            loadUpload: false
        }))
    };
    onSendAudio = (text) => {
        let message = {
            _id: uuid(),
            createdAt: new Date(),
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
            audio: this.state.audioUri,
        };
        if (text){
            message.text= text
        }
        message.add = moment(message.createdAt).format('LLLL');
        message.add = moment(message.createdAt).format('LLLL');
        let messages = [message];
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
            imgSource:null,
            imageUri:null,
            modalVisible:false,
            loadUpload: false
        }))
    };
    onCloseModal = () => {
        this.setState(previousState => ({
            modalVisible:false,
        }))
    }
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
    _onPlaybackStatusUpdate = playbackStatus => {

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

    renderAudio = (props) => {
        return !props.currentMessage.audio ? (
            <View />
        ) : (
            <TouchableOpacity transparent onPress={ async () => {
                this.setState({
                    playAudio: true
                });
                // const soundObject = new Audio.Sound();

                // soundObject.createAsync(props.currentMessage.audio, {}, function (e) {
                //     console.log(e);
                // } , false);
                this.state.sound
                    await this.state.sound.loadAsync({uri:props.currentMessage.audio});
                let status =  await this.state.sound.getStatusAsync();
                // console.log(this.state.sound,'lllllll');
                this.state.sound.setOnPlaybackStatusUpdate(this._onPlaybackStatusUpdate);
                // soundObject.setStatusAsync()

                try {
                    await this.state.sound.playAsync();

                    // console.log(status);
                    this.setState({ playAudio: false });
                    // Your sound is playing!
                } catch (error) {
                    // An error occurred!
                }
                /*const sound = new Sound(props.currentMessage.audio, "", error => {
                    if (error) {
                        console.log("failed to load the sound", error);
                    }
                    this.setState({ playAudio: false });
                    sound.play(success => {
                        console.log(success, "success play");
                        if (!success) {
                            Alert.alert("There was an error playing this audio");
                        }
                    });
                });*/
            }}>

                <Text>plays</Text>
            </TouchableOpacity>

        );
    };
    renderBubble = props => {
        return (
            <View>
                {this.renderName(props)}
                {this.renderAudio(props)}
                <Bubble {...props} />
            </View>
        );
    };

    render() {
        return (
            <SafeAreaView forceInset={{top: "nevers",bottom:"always"}} style={{ flex: 1}}>
                <DisplayModalImage
                    modalVisible={this.state.modalVisible}
                    uri={this.state.imageUri}
                    onSendImage={this.onSendImage}
                    loadUpload={this.state.loadUpload}
                    onClose={this.onCloseModal}
                />
                <KeyboardAvoidingView
                    style={{
                        flex: 1,
                        backgroundColor: '#fff',
                        padding:10}}
                    contentContainerStyle={{justifyContent:'center', alignItems:'center'}}
                    // behavior="padding"
                    // keyboardVerticalOffset={150}
                >

                    <GiftedChat
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        renderInputToolbar={this.renderInputToolbar}
                        renderBubble={this.renderBubble}
                        maxComposerHeight={50}
                        // renderMessageVideo={this.renderMessageVideo}
                        minInputToolbarHeight={this.state.size}
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
                </KeyboardAvoidingView>
            </SafeAreaView>

        )
    }
}