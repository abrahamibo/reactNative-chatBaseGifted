import React, { useState, useEffect } from 'react';
import { Text, View, TouchableOpacity } from 'react-native';
import { Camera } from 'expo-camera';
import BottomBar from "../BottomBar/BottomBar";
import styles from "./CameraScene.style";

export default class CameraScene extends React.Component {
    constructor(props) {
        super(props);
        this.camera = React.createRef();
        this.state = {
            hasPermission:null,
            type:Camera.Constants.Type.back,
            mode:"photo"
        }
    }
    componentDidMount() {
        this.requestPermission()
    }
    requestPermission = async () => {
        const {status} = await Camera.requestPermissionsAsync();
        this.setState({hasPermission:(status === 'granted')})
    }
    render() {
        const { onSetState } = this.props;
        if (this.state.hasPermission === null) {
            return <View/>;
        }
        if (this.state.hasPermission === false) {
            return <Text>No access to camera</Text>;
        }
        return (<View style={styles.container}>
            <Camera
                // ref={ref => {
                //     this.camera = ref;
                // }}
                ref={this.camera}
                style={styles.camera}
                type={this.state.type}>
                <BottomBar camera={this.camera} mode={this.state.mode} onSetState={onSetState}/>
            </Camera>
        </View>);
    }
}