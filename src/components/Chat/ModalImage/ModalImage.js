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
import core from "../../../styles/core.styles";
import SafeAreaView from 'react-native-safe-area-view';


export class DisplayModalImage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            text:null
        }
    }

    render() {

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
                <SafeAreaView forceInset={{top: "always",bottom:"always"}} style={{ flex: 1}}>
                    <View style={{height: "100%", width: "100%", backgroundColor: core.colors.black1,alignItems:'center'}}>


                        <ImageBackground source={{uri: this.props.uri}}
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
                            <TouchableOpacity
                                style={{position: 'absolute', right: 15, top: 15}}
                                onPress={this.props.onClose}>
                                <Image
                                    style={{
                                        height: 16.5,
                                        width: 16.5
                                    }}
                                    source={require("../../../../assets/icon/picture.png")}/>
                            </TouchableOpacity>
                            <View style={{
                                flexDirection: 'row',
                                alignItems: 'center',
                                justifyContent:'space-around',
                                width: '90%',
                                height: 'auto',
                                minHeight: 50,
                                borderRadius: 12,
                                borderWidth: 1,
                                paddingLeft:10,
                                paddingRight:10,
                                borderColor: core.colors.watermelonTwo,
                                position: 'absolute',
                                top: 49,


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
                                <TouchableHighlight onPress={() => this.props.onSendImage(this.state.text)}>
                                    <Image
                                        style={{
                                            width: 20,
                                            height: 20,
                                            marginRight: 10.2,
                                        }}
                                        source={require('../../../../assets/icon/search.png')}
                                    />
                                </TouchableHighlight>
                            </View>
                        </ImageBackground>
                    </View>
                </SafeAreaView>
            </Modal>
        );
    }
}