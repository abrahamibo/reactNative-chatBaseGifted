import React, { Component } from "react";
import {
    Text,
    TouchableOpacity,
    View
} from "react-native";
import {Ionicons} from "@expo/vector-icons";
import styles from "./MoreOptions.style";

export default class MoreOptions extends Component{

    handlePressPreviousPictureSize = () => this.changePictureSize(1);
    handlePressNextPictureSize = () => this.changePictureSize(-1);
    handlePressPreviousVideoSize = () => this.changeVideoSize(1);
    handlePressNextVideoSize = () => this.changeVideoSize(-1);

    changeVideoSize = direction => {
        const { videoSizeId, videoSizes, onSetStateCamera } = this.props
        const length = videoSizes.length;

        let newId = videoSizeId + direction;

        if (newId >= length) {
            newId = 0;
        } else if (newId < 0) {
            newId = length -1;
        }

        onSetStateCamera({ videoSize: videoSizes[newId], videoSizeId: newId });
    }
    changePictureSize = direction => {
        const { pictureSizeId, pictureSizes, onSetStateCamera } = this.props
        const length = pictureSizes.length;

        let newId = pictureSizeId + direction;

        if (newId >= length) {
            newId = 0;
        } else if (newId < 0) {
            newId = length -1;
        }

        onSetStateCamera({ pictureSize: pictureSizes[newId], pictureSizeId: newId });
    }

    render() {
        const { pictureSize, videoSize } = this.props;

        return (
            <View style={styles.container}>
                <View style={styles.pictureSizeContainer}>
                    <Text style={styles.pictureQualityLabel}>Image quality</Text>
                    <View style={styles.pictureSizeChooser}>
                        <TouchableOpacity
                            onPress={this.handlePressPreviousPictureSize}
                            style={styles.pictureSizeChooserDirection}>
                            <Ionicons name="md-arrow-dropleft" size={40} color="white" />
                        </TouchableOpacity>
                        <View style={styles.pictureSizeLabel}>
                            <Text style={{color: 'white'}}>{pictureSize}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={this.handlePressNextPictureSize}
                            style={styles.pictureSizeChooserDirection}>
                            <Ionicons name="md-arrow-dropright" size={40} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={styles.pictureSizeContainer}>
                    <Text style={styles.pictureQualityLabel}>Video quality</Text>
                    <View style={styles.pictureSizeChooser}>
                        <TouchableOpacity
                            onPress={this.handlePressPreviousVideoSize}
                            style={styles.pictureSizeChooserDirection}>
                            <Ionicons name="md-arrow-dropleft" size={40} color="white" />
                        </TouchableOpacity>
                        <View style={styles.pictureSizeLabel}>
                            <Text style={{color: 'white'}}>{videoSize}</Text>
                        </View>
                        <TouchableOpacity
                            onPress={this.handlePressNextVideoSize}
                            style={styles.pictureSizeChooserDirection}>
                            <Ionicons name="md-arrow-dropright" size={40} color="white" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        )
    }
}