import React, {Component, useState} from 'react'
import {Bubble, Composer, GiftedChat, Send} from 'react-native-gifted-chat'
import {Image, KeyboardAvoidingView, Text, View,TouchableOpacity} from "react-native";
import InputToolbar from "../../components/Chat/InputToolbar/InputToolbar";
import colors from "../../styles/core/colors.styles";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import {Audio, Video} from 'expo-av';

import {ModalMedia} from "../../components/Chat/ModalMedia/ModalMedia";
import SafeAreaView from 'react-native-safe-area-view';
import moment from "moment";
import uuid from "uuid/v4";
import messages from "./messageFake";
import CameraScene from "../../components/Chat/Camera/CameraScene/CameraScene";

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
            modalVisible:false,
            mediaSource:null,
            mediaUri:null,
            mediaType:null,
            isEnableMic: false,
            loadUpload:false,
            recording:null,
            audioSource:null,
            audioUri:null,
            sound:new Audio.Sound(),
            playAudio:false,
            progress:0,
            size:70,
            recEnd:false,
            cameraOn:false,
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
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);
        if (status !== 'granted') {
            alert('Sorry, we need camera roll permissions to make this work!');
            // }
        }
    };



    /*onPicture = async (type) => {
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
                        mediaSource: response,
                        mediaUri: result.uri,
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

    };*/
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
    onSetState = ( states) => {
        this.setState(states)
    }

    renderInputToolbar = props => <InputToolbar {...props}
        // onPicture={this.onPicture}
                                                onMic={this._mic}
                                                onMicOut={this._MicOut}
                                                onMicIn={this._MicIn}
                                                onMicPlay={this._MicPlay}
                                                isEnableMic={this.state.isEnableMic}
                                                recording={this.state.recording}
                                                sound={this.state.sound}
                                                recEnd={this.state.recEnd}
                                                onSetState={this.onSetState}
                                                onSendMedia={this.onSendMedia}


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
                useNativeControls={true}
                style={{ width: 100, height: 100 }}
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
    onSend(messages = []) {
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }
    onSendMedia = (text, type) => {
        console.log(this.state.mediaUri);
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

        };
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
        message.add = moment(message.createdAt).format('LLLL');
        let messages = [message];
        console.log(messages);
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
            mediaSource:null,
            mediaUri:null,
            modalVisible:false,
            loadUpload: false
        }))
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
    onPlayAudio = async (props) => {
        this.setState({
            playAudio: true
        });
        let status = await this.state.sound.getStatusAsync();

        if (status.isLoaded){
            await this.state.sound.stopAsync();
            await this.state.sound.unloadAsync();
        }
        await this.state.sound.loadAsync({uri:props.currentMessage.audio});
        this.state.sound.setOnPlaybackStatusUpdate(this.onPlaybackStatusUpdate);

        try {
            await this.state.sound.playAsync();
            this.setState({ playAudio: false });
        } catch (error) {
            // An error occurred!
        }
    }
    renderAudio = (props) => {
        // console.log(props.currentMessage);
        return !props.currentMessage.audio ? (
            <View />
        ) : (
            <View style={{padding:10}}>
                <TouchableOpacity transparent onPress={() => this.onPlayAudio(props)}>
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
                            renderMessageVideo={this.renderMessageVideo}
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
                }


            </SafeAreaView>

        )
    }
}

function Example() {
    // Déclaration d'une nouvelle variable d'état, que l'on appellera “count”
    const [count, setCount] = useState(0);
    console.log(count)
    return (
        <View>
            <Text>Vous avez cliqué {count} fois</Text>
            <TouchableOpacity onClick={() => {setCount(count + 1);
                console.log(count);}}>
               <Text> Cliquez ici</Text>
            </TouchableOpacity>
        </View>
    );
}