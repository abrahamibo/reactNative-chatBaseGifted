import React, {Component} from "react";
import {TouchableOpacity, View} from "react-native";
import {Foundation, Ionicons, Octicons} from "@expo/vector-icons";
import styles from "./BottomBar.style";


export default class BottomBar extends Component{

    constructor(props) {
        super(props);
        this.state = {
            mode: props.mode,
            record:false
        }
    }

    takeMedia = async(mode, action) => {
        const camera = this.props.camera.current;
        const onSetState = this.props.onSetState;
        if (camera) {
            if (mode === "photo") {

                const options = {
                    quality: 0.5,
                    base64: false, /*onPictureSaved: this.onPictureSaved*/
                };
                const photo = await camera
                    .takePictureAsync(options)
                    .then(data => {
                        fetch(data.uri)
                            .then((response) => response.blob())
                            .then((response) => {
                                onSetState({
                                    mediaSource: response,
                                    mediaUri: data.uri,
                                    mediaType: 'image',
                                    modalVisible: true,
                                    cameraOn: false
                                })
                            });

                    });
            } else if(mode === "camera"){
                const options = {
                    quality: 0.5,
                    base64: false, /*onPictureSaved: this.onPictureSaved*/
                };
                let record;
                switch (action) {
                    case "recPlay":
                        camera.resumePreview();
                        record = true;
                        break;
                    case "recStop":
                        camera.stopRecording();
                        record = false;
                        break;
                    case "recPause":
                        camera.pausePreview();
                        record = true;
                        break;
                    default:
                        this.setState({
                            record:true
                        })
                        let video = await camera
                            .recordAsync()
                            .then((data) => {
                                fetch(data.uri)
                                    .then((response) => response.blob())
                                    .then((response) => {
                                        console.log(data, "data");
                                        onSetState({
                                            mediaSource: response,
                                            mediaUri: data.uri,
                                            mediaType: 'video',
                                            modalVisible: true,
                                            cameraOn: false
                                        })
                                    });
                            });
                        break;
                }
                this.setState({
                    record:record
                })

            }
        }
    };

    render() {
        const {takeMedia} = this.props;
        const {mode, record} = this.state;

        return (
            <View
                style={styles.bottomBar}
            >
                <TouchableOpacity
                    style={styles.bottomButton}
                    onPress={this.toggleMoreOptions}>
                    <Octicons name="kebab-horizontal" size={30} color="white"/>
                </TouchableOpacity>
                <View
                    style={{
                        flexDirection:'row',
                        justifyContent:"space-around",
                        height: 58,
                        flex: 0.5,
                    }}
                >
                    {mode === "camera" && record
                        ? <TouchableOpacity
                            onPress={() => this.takeMedia(mode,"recPlay")}
                            style={{
                                height: 58,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Foundation
                                name="record"
                                size={30}
                                color="white"
                            />
                        </TouchableOpacity> : null}
                    <TouchableOpacity
                        onPress={() => {
                            console.log((mode === "camera" && record));
                            console.log((mode));
                            if (mode === "camera" && record) {
                                this.takeMedia(mode, 'recStop')
                            } else {
                                this.takeMedia(mode)
                            }
                        }}
                        style={{
                            height: 58,
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginRight: 20,
                            marginLeft: 20
                        }}
                    >
                        <Ionicons
                            name="ios-radio-button-on"
                            size={70}
                            color="white"
                        />
                    </TouchableOpacity>
                    {mode === "camera" && record
                        ? <TouchableOpacity
                            onPress={() => this.takeMedia(mode,"recPause")}
                            style={{
                                height: 58,
                                justifyContent: 'center',
                                alignItems: 'center',
                            }}
                        >
                            <Ionicons
                                name="ios-pause"
                                size={30}
                                color="white"
                            />
                        </TouchableOpacity> : null}
                </View>
                <View
                    style={styles.bottomButton}
                >
                    {
                        mode === "photo"
                            ?
                            <TouchableOpacity
                                onPress={() => this.setState({mode:"camera"})}
                            >
                                <Ionicons name="ios-camera" size={30} color="white"/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity
                                onPress={() => this.setState({mode:"photo"})}
                            >
                                <Ionicons name="ios-videocam"size={30} color="white"/>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}