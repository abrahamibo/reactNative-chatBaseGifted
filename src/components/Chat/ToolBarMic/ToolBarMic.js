import {Text, View,TouchableOpacity} from "react-native";
import React, {Component} from "react";
// import styles from "../ToolBarMic/ToolBarMic.style";
import core from "../../../styles/core.styles";



export default class ToolBarMic extends Component {

    constructor(props) {
        super(props)
    }

    render() {
        const { recEnd, onMic, onMicIn, onMicOut, onMicPlay } = this.props;

        return (<View style={{
            minHeight: 44,
            height:'100%',
            flexDirection:'row',
            alignItems:'center',
            backgroundColor: core.colors.black,
            shadowColor: core.colors.white,
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
            <TouchableOpacity transparent
                    onPress={() => onMic('close')}
                    style={{backgroundColor:core.colors.redDegradEnd,marginRight: 20}}>
                <Text>
                    quitter
                </Text>
            </TouchableOpacity>
            <TouchableOpacity transparent
                    onPressIn={onMicIn}
                    onPressOut={onMicOut}
                    style={{marginRight: 20}}>
                <Text>
                    rec
                </Text>
            </TouchableOpacity>
            {recEnd
                ?
                <View style={{flexDirection: 'row', alignItems:'center'}}>
                    <TouchableOpacity transparent
                            onPress={onMicPlay}
                            style={{marginRight: 18}}>
                        <Text>
                            plays
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity transparent
                            onPress={() => onMic('valider')}
                            style={{marginRight: 18}}>
                        <Text>
                            valider
                        </Text>
                    </TouchableOpacity>
                </View>
                :
                null
            }

        </View>)
    }
}