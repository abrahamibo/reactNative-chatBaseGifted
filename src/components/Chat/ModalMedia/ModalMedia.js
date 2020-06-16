import React,{Component} from "react";
import {
    Modal,
    View,
    ImageBackground,
    TextInput,
    KeyboardAvoidingView,
    TouchableOpacity
} from 'react-native';
import {Video} from "expo-av";
import {Ionicons} from "@expo/vector-icons";
import styles from "./ModalMedia.style";


export class ModalMedia extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text:null
        }
    }

    onClose = (setState) => {
        setState({
            modalVisible:false,
        })
    }
    render() {
        const { onSetState, mediaUri, mediaType, onUploadMedia  } =this.props;
        return (
            <Modal
                animationType="slide"
                visible={this.props.modalVisible}
            >
                {
                    this.props.loadUpload &&
                    <View style={styles.container}>
                        <Spinner color='red'/>
                    </View>
                }
                <KeyboardAvoidingView style={styles.container}>
                    <TouchableOpacity
                        style={styles.buttonBack}
                        onPress={() => this.onClose(onSetState)}>
                        <Ionicons name="md-arrow-round-back" size={50} color="white"/>
                    </TouchableOpacity>

                    {
                        mediaType === "image"
                            ?
                            <ImageBackground source={{uri: mediaUri}}
                                             resizeMode="contain"
                                             imageStyle={styles.image}
                                             style={styles.imageBackground}>

                            </ImageBackground>
                            :
                            <Video
                                ref={(ref) => this.video = ref}
                                source={{uri: mediaUri}}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                useNativeControls={true}
                                style={styles.video}
                            />
                    }
                    <View style={styles.inputTextContainer}>
                        <TextInput
                            style={styles.inputText}
                            onChangeText={(text) => this.setState({text:text})}
                            multiline={false}
                        />
                        <TouchableOpacity onPress={() => onUploadMedia(this.state.text, mediaType)}>
                            <Ionicons name="md-send" size={30} color="#1157ff"/>
                        </TouchableOpacity>
                    </View>
                </KeyboardAvoidingView>
            </Modal>
        );
    }
}