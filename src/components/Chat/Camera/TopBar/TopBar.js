import React, { Component } from "react";
import {
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {
    Ionicons,
    MaterialIcons
} from "@expo/vector-icons";
import styles from "./TopBar.style";

export default class TopBar extends Component{

    constructor(props) {
        super(props);
        this.flashModeOrder = {
            off: 'on',
            on: 'auto',
            auto: 'torch',
            torch: 'off',
        };
        this.wbOrder = {
            auto: 'sunny',
            sunny: 'cloudy',
            cloudy: 'shadow',
            shadow: 'fluorescent',
            fluorescent: 'incandescent',
            incandescent: 'auto',
        };
        this.flashIcons = {
            off: 'flash-off',
            on: 'flash-on',
            auto: 'flash-auto',
            torch: 'highlight'
        };
        this.wbIcons = {
            auto: 'wb-auto',
            sunny: 'wb-sunny',
            cloudy: 'wb-cloudy',
            shadow: 'beach-access',
            fluorescent: 'wb-iridescent',
            incandescent: 'wb-incandescent',
        };
        // this.ratios = {
        //
        // }
    }

    handlePressToggleFacing = () => this.props.onSetStateCamera({ type: this.props.type === 'back' ? 'front' : 'back' });
    handlePressToggleFlash = () => this.props.onSetStateCamera({ flashMode: this.flashModeOrder[this.props.flashMode] });
    handlePressToggleWB = () => this.props.onSetStateCamera({ whiteBalance: this.wbOrder[this.props.whiteBalance] });
    handlePressToggleFocus = () => this.props.onSetStateCamera({ autoFocus: this.props.autoFocus === 'on' ? 'off' : 'on' });
    handlePressOnClose = (setState) => setState({cameraOn:false});


    render() {
        const { whiteBalance, autoFocus, flashMode, onSetState } = this.props;

        return (
            <View style={styles.container}>
                <TouchableOpacity
                    style={styles.toggleButton}
                    onPress={() => this.handlePressOnClose(onSetState)}>
                    <Ionicons name="md-arrow-round-back" size={50} color="white"/>
                </TouchableOpacity>
                    <TouchableOpacity style={styles.toggleButton} onPress={this.handlePressToggleFacing}>
                        <Ionicons name="ios-reverse-camera" size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toggleButton} onPress={this.handlePressToggleFlash}>
                        <MaterialIcons name={this.flashIcons[flashMode]} size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toggleButton} onPress={this.handlePressToggleWB}>
                        <MaterialIcons name={this.wbIcons[whiteBalance]} size={32} color="white" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.toggleButton} onPress={this.handlePressToggleFocus}>
                        <Text style={[styles.autoFocusLabel, { color: autoFocus === 'on' ? "white" : "#6b6b6b" }]}>AF</Text>
                    </TouchableOpacity>
            </View>
        )
    }
}