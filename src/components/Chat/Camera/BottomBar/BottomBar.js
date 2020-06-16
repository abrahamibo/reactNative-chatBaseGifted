import React, {Component} from "react";
import {
    TouchableOpacity,
    View
} from "react-native";
import {Foundation, Ionicons, Octicons} from "@expo/vector-icons";
import styles from "./BottomBar.style";
import {Camera} from "expo-camera";


export default class BottomBar extends Component{

    constructor(props) {
        super(props);
        this.state = {
            mode: props.mode,
            record:false
        }
    }

    handlePressTakeMedia = async(mode, action) => {
        const camera = this.props.camera.current;
        const { onSetState, videoSize } = this.props

        if (camera) {
            if (mode === "photo") {

                const options = {
                        quality: 1,
                        base64: false, /*onPictureSaved: this.onPictureSaved*/
                    },
                    photo = await camera
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
                    quality: Camera.Constants.VideoQuality[videoSize],
                    base64: false,
                };
                let record;
                console.log(action);
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
                                console.log(data);
                                fetch(data.uri)
                                    .then((response) => response.blob())
                                    .then((response) => {
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
    handlePressTakeMediaChoice = (mode) => {
        const {record} = this.state;

        if (mode === "camera" && record) {
            this.handlePressTakeMedia(mode, 'recStop')
        } else {
            this.handlePressTakeMedia(mode)
        }
    };
    handlePressToggleMoreOptions = () => this.props.onSetStateCamera({ showMoreOptions: !this.props.showMoreOptions });

    render() {
        const {mode, record} = this.state;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.bottomButton}
                    onPress={this.handlePressToggleMoreOptions}>
                    <Octicons name="kebab-horizontal" size={30} color="white"/>
                </TouchableOpacity>
                <View style={styles.buttonsCenterContaint}>
                    {
                        (mode === "camera" && record) &&
                        <TouchableOpacity
                            onPress={() => this.handlePressTakeMedia(mode,"recPlay")}
                            style={styles.buttonRec}
                        >
                            <Foundation name="record" size={30} color="white" />
                        </TouchableOpacity>
                    }
                    <TouchableOpacity
                        onPress={() => this.handlePressTakeMediaChoice(mode)}
                        style={styles.buttonTake}
                    >
                        <Ionicons name="ios-radio-button-on" size={70} color="white" />
                    </TouchableOpacity>
                    {
                        (mode === "camera" && record) &&
                        <TouchableOpacity
                            onPress={() => this.handlePressTakeMedia(mode,"recPause")}
                            style={styles.buttonRec}
                        >
                            <Ionicons name="ios-pause" size={30} color="white" />
                        </TouchableOpacity>
                    }
                </View>
                <View style={styles.bottomRL}>
                    {
                        mode === "photo"
                            ?
                            <TouchableOpacity onPress={() => this.setState({mode:"camera"})}>
                                <Ionicons name="ios-camera" size={30} color="white"/>
                            </TouchableOpacity>
                            :
                            <TouchableOpacity onPress={() => this.setState({mode:"photo"})}>
                                <Ionicons name="ios-videocam"size={30} color="white"/>
                            </TouchableOpacity>
                    }
                </View>
            </View>
        )
    }
}

