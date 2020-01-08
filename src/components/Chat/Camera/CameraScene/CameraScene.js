import React, { useState, useEffect } from 'react';
import {
    Text,
    View,
    Platform
} from 'react-native';
import { Camera } from 'expo-camera';
import BottomBar from "../BottomBar/BottomBar";
import styles from "./CameraScene.style";

import * as FileSystem from "expo-file-system";
import MoreOptions from "../MoreOptions/MoreOptions";
import TopBar from "../TopBar/TopBar";

export default class CameraScene extends React.Component {
    constructor(props) {
        super(props);
        this.camera = React.createRef();
        this.state = {
            hasPermission:null,
            mode:"photo",
            type:"back",
            flashMode: 'off',
            autoFocus: 'on',
            zoom: 0,
            whiteBalance: 'auto',
            showMoreOptions:false,
            ratio: '16:9',
            pictureSize: undefined,
            videoSize: undefined,
            videoSizes: [],
            videoSizeId: 0,
            pictureSizes: [],
            pictureSizeId: 0,
            ratios: [],
            faceDetecting: false,
            faces: [],
            permissionsGranted: false,
            videoUri:null,
        }
    }

    componentDidMount() {
        this.requestPermission()
        console.log(this.camera);
    }

    requestPermission = async () => {
        const {status} = await Camera.requestPermissionsAsync();
        this.setState({hasPermission:(status === 'granted')})
    }
    getRatios = async () => {
        const ratios = await this.camera.current.getSupportedRatiosAsync();
        return ratios;
    };
    setRatio = ratio => this.setState({ ratio });
    zoomOut = () => this.setState({ zoom: this.state.zoom - 0.1 < 0 ? 0 : this.state.zoom - 0.1 });
    zoomIn = () => this.setState({ zoom: this.state.zoom + 0.1 > 1 ? 1 : this.state.zoom + 0.1 });
    setFocusDepth = depth => this.setState({ depth });


    collectMediaSizes = async () => {
        if (this.camera.current) {
            const pictureSizes = await this.camera.current.getAvailablePictureSizesAsync(this.state.ratio);
            // const ratios = await this.camera.current.getSupportedRatiosAsync();
            const videoSizes = Object.keys(Camera.Constants.VideoQuality);

            let pictureSizeId = 0;
            let videoSizeId = 0;
            if (Platform.OS === 'ios') {
                pictureSizeId = pictureSizes.indexOf('High');
                videoSizeId = videoSizes.indexOf('High');

            } else {
                pictureSizeId = pictureSizes.length-1;
                videoSizeId = videoSizes.length-1;
            }
            this.setState({ pictureSizes, pictureSizeId, pictureSize: pictureSizes[pictureSizeId], videoSizes, videoSizeId, videoSize: videoSizes[videoSizeId] });
        }
    };
    handleMountError = ({ message }) => console.error(message);

    onSetStateCamera = ( states) => {
        this.setState(states)
    }

    render() {
        const { onSetState } = this.props;
        const {
            pictureSizeId, pictureSizes, pictureSize,
            videoSizeId, videoSizes, videoSize,
            type, flashMode, whiteBalance, autoFocus,
            mode, showMoreOptions
        } = this.state;

        if (this.state.hasPermission === null) {
            return (
                <View style={styles.noPermissions}>
                    <Text style={styles.noPermissionsText}>
                        Camera permissions not granted - cannot open camera preview.
                    </Text>
                </View>
            );
        }
        if (this.state.hasPermission === false) {
            return (
                <View style={styles.noPermissions}>
                    <Text style={styles.noPermissionsText}>
                        No access to camera
                    </Text>
                </View>
            );
        }
        return (
            <View style={styles.container}>
                <Camera
                    ref={this.camera}

                    type={this.state.type}
                    zoom={this.state.zoom}
                    ratio={this.state.ratio}
                    autoFocus={this.state.autoFocus}
                    flashMode={flashMode}
                    pictureSize={this.state.pictureSize}
                    whiteBalance={this.state.whiteBalance}
                    onCameraReady={this.collectMediaSizes}
                    onMountError={this.handleMountError}
                    onFacesDetected={this.state.faceDetecting ? this.onFacesDetected : undefined}
                    onFaceDetectionError={this.onFaceDetectionError}

                    style={styles.camera}
                >
                    <TopBar
                        type={type}
                        flashMode={flashMode}
                        autoFocus={autoFocus}
                        whiteBalance={whiteBalance}
                        onSetStateCamera={this.onSetStateCamera}
                        onSetState={onSetState}
                    />
                    <BottomBar
                        camera={this.camera}
                        mode={mode}
                        videoSize={videoSize}
                        onSetState={onSetState}
                        showMoreOptions={showMoreOptions}
                        onSetStateCamera={this.onSetStateCamera}
                    />
                </Camera>
                {
                    this.state.showMoreOptions &&
                    <MoreOptions pictureSizeId={pictureSizeId}
                                 pictureSizes={pictureSizes}
                                 pictureSize={pictureSize}
                                 videoSizeId={videoSizeId}
                                 videoSizes={videoSizes}
                                 videoSize={videoSize}
                                 onSetStateCamera={this.onSetStateCamera}
                    />
                }
            </View>
        );
    }
}
