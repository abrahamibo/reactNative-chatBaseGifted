import React,{Component} from "react";
import {
    Alert,
    Dimensions,
    Image,
    Modal,
    StyleSheet,
    Text,
    TouchableHighlight,
    View,
    ImageBackground,
    TextInput, KeyboardAvoidingView,TouchableOpacity
} from 'react-native';
import {Ionicons, MaterialIcons} from "@expo/vector-icons";

import core from "../../../styles/core.styles";
import SafeAreaView from 'react-native-safe-area-view';
import {Video} from "expo-av";


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
        const { onSetState, mediaUri, mediaType, onSendMedia  } =this.props;
        return (
            <Modal
                animationType="slide"
                visible={this.props.modalVisible}
            >

                {this.props.loadUpload ?
                    <Content contentContainerStyle={{flex:1, position:'absolute', top:0, justifyContent: 'center', alignItems: 'center',backgroundColor: core.colors.charcoalGrey6
                    }}>
                        <Spinner color='red'/>
                    </Content>:null
                }
                    <KeyboardAvoidingView
                        style={{
                            flex: 1,
                            backgroundColor: '#232323',
                            alignItems:'center',
                            justifyContent:'center'
                            }}
                    >
                        <TouchableOpacity
                            style={{position: 'absolute', left: 15, top: 0,zIndex:999}}
                            onPress={() => this.onClose(onSetState)}>
                            <Ionicons name="md-arrow-round-back" size={50} color="white"/>
                        </TouchableOpacity>

                        {mediaType === "image"
                            ? <ImageBackground source={{uri: mediaUri}}
                                         resizeMode="contain"
                                         imageStyle={{height: "100%", width: "100%", maxWidth: 'auto', maxHeight: 'auto'}}
                                         style={{
                                             height: "100%",
                                             width: "100%",
                                             maxWidth: 'auto',
                                             maxHeight: 'auto',
                                             justifyContent: 'flex-end',
                                             alignItems:'center'
                                         }}>

                        </ImageBackground>
                        : <Video
                                ref={(ref) => this.video = ref}
                                source={{uri: mediaUri}}
                                // style={{
                                //     flex:1,
                                //
                                //     // position: "absolute",
                                //     // top: 0,
                                //     // left: 0,
                                //     alignItems: "stretch",
                                //     bottom: 0,
                                //     right: 0
                                // }}
                                rate={1.0}
                                volume={1.0}
                                isMuted={false}
                                resizeMode="cover"
                                useNativeControls={true}
                                style={{ width: 300, height: 300 }}
                            />
                        }
                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent:'center',
                            width: '90%',
                            height: 'auto',
                            minHeight: 50,
                            borderRadius: 12,
                            borderWidth: 1,
                            paddingLeft:10,
                            paddingRight:10,
                            borderColor: core.colors.white,
                            backgroundColor: core.colors.white,
                            position: 'absolute',
                            bottom: 10,
                            zIndex:999


                        }}>
                            <TextInput
                                style={{
                                    width: '80%',
                                    minHeight: 50,
                                }}
                                onChangeText={(text) => this.setState({text:text})}
                                onEndEditing={this.props.onEndEditing}
                                onSubmitEditing={this.props.onSubmitEditing}
                                placeholder={this.props.placeholder}
                                value={this.props.value}
                                multiline={false}
                            />
                            <TouchableOpacity onPress={() => onSendMedia(this.state.text, mediaType)}>
                                <MaterialIcons name="send" size={30} color="blue"/>


                            </TouchableOpacity>
                        </View>

                    </KeyboardAvoidingView>
            </Modal>
        );
    }
}