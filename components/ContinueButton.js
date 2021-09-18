import React, { Component } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

import { COLORS, FONTS, SIZES } from '../constants';

class ContiuneButton extends Component {

    handlePress = (routeName) => {
        this.props.navigation.navigate(routeName);
    }

    render() {
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    paddingTop: SIZES.padding * 2,
                    paddingRight: SIZES.padding * 2,
                }}>
                <TouchableOpacity onPress={() => this.handlePress(this.props.to)}>
                    <Text style={{
                        color: COLORS.primary,
                        ...FONTS.h5
                    }}>
                        {this.props.buttonLabel}
                    </Text>
                </TouchableOpacity>
            </View>
        );
    }
}

export default ContiuneButton;