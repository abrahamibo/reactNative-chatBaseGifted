import React from "react";
import * as Permissions from "expo-permissions";
import {Audio} from "expo-av";
import uuid from "uuid/v4";
import firebase from "../utils/firebase";
import moment from "moment";
import {Bubble, Composer, GiftedChat, InputToolbar, Send} from "react-native-gifted-chat";
import * as ImagePicker from "expo-image-picker";
import {ChivoText} from "./ChivoText";
import {Image, KeyboardAvoidingView, StyleSheet, Text, View} from "react-native";
import Colors from "../constants/Colors";
import {Button, Container, Content, Spinner} from "native-base";
import {DisplayModalImage} from "./DisplayModal";

export class ChatView extends React.Component{
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
            playAudio:false,
            progress:0,
            recEnd:false
        };
    }

    componentDidMount() {
        this._askForPermissions();
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

    _enabledMic = async (type) => {
        if (type){

            this.setState({
                isEnableMic: true,
                recording: new Audio.Recording()
            });
            // let recording = this.state.recording;
            try {
                await Audio.setAudioModeAsync({
                    allowsRecordingIOS: true,
                    interruptionModeIOS:Audio.INTERRUPTION_MODE_IOS_MIX_WITH_OTHERS,
                    playsInSilentModeIOS:true,
                    staysActiveInBackground:false,
                    interruptionModeAndroid:Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
                    shouldDuckAndroid:true,
                    playThroughEarpieceAndroid:true
                });
                let prepare = await this.state.recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
                console.log(prepare);
            } catch (error) {
                // An error occurred!
                console.log(error);
            }
        }else {

            this.setState({
                isEnableMic: false,
                recording:null,
                recEnd:false
            });
        }
    };
    _MicIn = async (type) => {
        // this.setState({
        //     isEnableMic: true,
        // });
        try {
            await this.state.recording.startAsync();

            // You are now recording!
        } catch (error) {
            // An error occurred!
            console.log(error);
        }
    };
    _MicOut = async (type) => {
        await this.state.recording.stopAndUnloadAsync();
        let url = await this.state.recording.getURI();
        console.log(url,'urlurl');
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

    uploadAudio = (text) => {
        const ext = this.state.audioUri.split('.').pop(); // Extract image extension
        const filename = `${uuid()}.${ext}`;
        this.setState({ uploading: true });
        let  uploadTask = firebase
            .storage()
            .ref(`chats/${this.props.chats.id}/audio/${filename}`)
            .put(this.state.audioSource);

        uploadTask.on('state_changed', (snapshot)=>{
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function(error) {
            // Handle unsuccessful uploads
            console.log(error);
        }, ()=> {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                let message = {
                    _id: uuid(),
                    createdAt: new Date(),
                    user: {
                        _id: GLOBAL.user.id,
                        name: GLOBAL.user.name,
                        avatar: GLOBAL.user.avatar,
                    },
                    audio: downloadURL,
                };
                console.log(text,'texttexttexttexttext');
                if (text){
                    message.text= text
                }
                message.add = moment(message.createdAt).format('LLLL');
                let messages = [message];
                console.log(this.props.chats.id);
                firebase.database().ref('chat/'+ this.props.chats.id).push().set(messages);
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, messages),
                    audioSource:null,
                    audioUri:null,
                    loadUpload: false
                }))
            });
        });
    };
    _MicPlay = async () => {
        let url = await this.state.recording.getURI();
        console.log(url);
        try {
            const soundObject = new Audio.Sound();
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
    _record = async () => {
        // this.setState({ audioRecord: new Audio.Recording() });
        try {
            const { sound: soundObject, status } = await Audio.Sound.createAsync(
                {uri:url},
                { shouldPlay: true }
            );
            // Your sound is playing!
        } catch (error) {
            // An error occurred!
        }
    };

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
    uploadImage = (text) => {
        const ext = this.state.imageUri.split('.').pop(); // Extract image extension
        const filename = `${uuid()}.${ext}`;
        this.setState({ uploading: true });
        let  uploadTask = firebase
            .storage()
            .ref(`chats/${this.props.chats.id}/images/${filename}`)
            .put(this.state.imgSource);

        uploadTask.on('state_changed', (snapshot)=>{
            // Observe state change events such as progress, pause, and resume
            // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
            var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            console.log('Upload is ' + progress + '% done');
            switch (snapshot.state) {
                case firebase.storage.TaskState.PAUSED: // or 'paused'
                    console.log('Upload is paused');
                    break;
                case firebase.storage.TaskState.RUNNING: // or 'running'
                    console.log('Upload is running');
                    break;
            }
        }, function(error) {
            // Handle unsuccessful uploads
            console.log(error);
        }, ()=> {
            // Handle successful uploads on complete
            // For instance, get the download URL: https://firebasestorage.googleapis.com/...
            uploadTask.snapshot.ref.getDownloadURL().then((downloadURL) => {
                console.log('File available at', downloadURL);
                let message = {
                    _id: uuid(),
                    createdAt: new Date(),
                    user: {
                        _id: GLOBAL.user.id,
                        name: GLOBAL.user.name,
                        avatar: GLOBAL.user.avatar,
                    },
                    image: downloadURL,
                };
                if (text){
                    message.text= text
                }
                message.add = moment(message.createdAt).format('LLLL');
                let messages = [message];
                firebase.database().ref('chat/' + this.props.chats.id).push().set(messages);
                this.setState(previousState => ({
                    messages: GiftedChat.append(previousState.messages, messages),
                    imgSource:null,
                    imageUri:null,
                    modalVisible:false,
                    loadUpload: false
                }))
            });
        });
    };
    _pickImagePhoto = async () => {
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        console.log(result,'resulttttt');

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };

    componentWillMount() {
        this.getPermissionAsync();

        this.setState({
            messages: [],
        });
        this.getDataMesage()
    }
    getDataMesage = () => {
        if (this.props.isLoadAjax) {
            // firebase.database().ref('chat/' + this.props.chats.id).on('value',  (snapshot) => {
            //     this.setState(previousState => ({
            //         message: snapshot.val()
            //     }))
            //     // console.log(snapshot.val(),'snapshot.val()s');
            // })
            firebase.database().ref('chat/' + this.props.chats.id).orderByKey().once('value', (snapshot)=> {
                let messages =[];


                console.log(messages);
                // messages = snapshot.map(node => {
                //         const message = {};
                //         message._id = node._id;
                //         message.text =  node.text ;
                //         message.createdAt = node.createdAt;
                //         message.user = {
                //             _id: node.user._id,
                //             name: node.user.name,
                //             avatar: node.user.avatar
                //         };
                //
                //         return message;
                //     });
                //     this.setState({
                //         messages: [...messages]
                //     });

                snapshot.forEach(function(childSnapshot) {
                    console.log(childSnapshot.val(),'------oo-----');
                    let message = {
                        _id: childSnapshot.val()[0]._id,
                        text: childSnapshot.val()[0].text,
                        createdAt: moment( childSnapshot.val()[0].add,"LLLL"),
                        // createdAt: ,
                        user: {
                            _id: childSnapshot.val()[0].user._id,
                            name: childSnapshot.val()[0].user.name,
                            avatar: childSnapshot.val()[0].user.avatar,
                        },
                    };
                    if (childSnapshot.val()[0].image){
                        message.image = childSnapshot.val()[0].image
                    }
                    if (childSnapshot.val()[0].audio){
                        message.audio = childSnapshot.val()[0].audio
                    }

                    messages.unshift(message);

                });
                this.setState(previousState => ({
                    messages: messages
                }))
                console.log(this.state.messages,'mmmmmmmesssage');
            });
        } else {
            setTimeout(() => {
                this.getDataMesage();
            },1000)
        }
    };
    inputToolbar (props) {
        //Add the extra styles via containerStyle
        return <InputToolbar {...props}  renderComposer={this.renderInputTtext} render={<ChivoText>esaaii</ChivoText>} containerStyle={{borderTopWidth: 5.5, borderTopColor: '#333'}} />
    }
    renderInputToolbar2 = props => {
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
                    {/*<TextInput style={{minWidth:20,height:'auto', borderTopWidth: 1.5, borderTopColor: '#333', backgroundColor:'blue'}}/>*/}
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
    };
    renderInputTtext (props) {
        //Add the extra styles via containerStyle
        return <Composer {...props} containerStyle={{borderTopWidth: 1.5, borderTopColor: '#333', backgroundColor:'red'}} Style={{width:150, borderTopColor: '#333', backgroundColor:'red'}} />
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
    renderAudio = (props) => {
        console.log(props.currentMessage,"props.currentMessage.audio");
        let i=0,
            ii=0;
        return !props.currentMessage.audio ? (
            <View />
        ) : (
            <Button transparent onPress={ async () => {
                this.setState({
                    playAudio: true
                });
                const soundObject = new Audio.Sound();
                // soundObject.createAsync(props.currentMessage.audio, {}, function (e) {
                //     console.log(e);
                // } , false);
                soundObject.setOnPlaybackStatusUpdate( (e) => {

                    i = e.durationMillis;
                    ii = e.positionMillis;
                    console.log(i);
                    console.log(ii);
                    // console.log(e);
                    this.setState({
                        progress: ii
                    });
                });

                try {
                    await soundObject.loadAsync({uri:props.currentMessage.audio});
                    await soundObject.playAsync();
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
            </Button>

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
    onSendImage = text => {
        this.setState({
            loadUpload:true
        })
        this.uploadImage(text)
    };
    onSend(messages = []) {
        let message = messages.messages;
        // console.log(messages.messages,"messsssageeeeee");
        messages[0].add = moment(messages[0].createdAt).format('LLLL');
        console.log(messages,"messages");
        firebase.database().ref('chat/' + this.props.chats.id).push().set(messages);
        this.setState(previousState => ({
            messages: GiftedChat.append(previousState.messages, messages),
        }))
    }
    handleAddPicture = async () => {
        const { user } = this.props; // wherever you user data is stored;
        const options = {
            title: "Select Profile Pic",
            mediaType: "photo",
            takePhotoButtonTitle: "Take a Photo",
            maxWidth: 256,
            maxHeight: 256,
            allowsEditing: true,
            noData: true
        };
        let result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
        });

        if (!result.cancelled) {
            this.setState({ image: result.uri });
        }
    };
    render() {
        if (this.props.isLoadAjax){
            return (
                <KeyboardAvoidingView
                    style={styles.container}
                    contentContainerStyle={{justifyContent:'center', alignItems:'center'}}
                    // behavior="padding"
                    keyboardVerticalOffset={150}
                >
                    <DisplayModalImage
                        modalVisible={this.state.modalVisible}
                        uri={this.state.imageUri}
                        onSendImage={this.onSendImage}
                        loadUpload={this.state.loadUpload}
                    />
                    <GiftedChat
                        inverted={true}
                        messages={this.state.messages}
                        onSend={messages => this.onSend(messages)}
                        renderBubble={this.renderBubble}

                        user={{
                            _id: GLOBAL.user.id,
                            name: GLOBAL.user.name,
                            avatar: GLOBAL.user.avatar,
                        }}
                        locale="fr"
                        renderInputToolbar={this.renderInputToolbar2}
                        // renderComposer={this.renderInputTtext}
                    />
                </KeyboardAvoidingView>
            )
        } else {
            return (
                <Container>
                    <Content contentContainerStyle={{justifyContent: 'center', alignItems: 'center'}}>
                        <Spinner color='red'/>
                    </Content>
                </Container>
            );
        }

    }
}

const styles = StyleSheet.create({
    containerGift: {
        backgroundColor: '#4c69a5',
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding:10,
        // alignItems: 'center',
        // justifyContent: 'center',
    },
});
