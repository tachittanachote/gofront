import React, { Component } from 'react';
import { View } from 'react-native';
import { Icon } from 'react-native-elements';
import { COLORS, SIZES } from '../constants';

class EmergencyButton extends Component {
    handleEmergency=()=>{
        
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    paddingTop: SIZES.padding * 2,
                    paddingLeft: SIZES.padding,
                    zIndex: 10000,
                }}>
                <Icon
                    onPress={() => this.handleEmergency()}
                    name="chevron-back-outline"
                    type="ionicon"
                    size={30}
                    color={COLORS.black}
                />
            </View>
        );
    }


}

export default EmergencyButton