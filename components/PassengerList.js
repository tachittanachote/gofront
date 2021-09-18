import React, { Component } from 'react';
import { View, Text, StyleSheet, TouchableWithoutFeedback } from 'react-native';
import { COLORS, FONTS, SIZES } from '../constants';

class PassengerList extends Component {

    constructor(props) {
        super(props);
        this.state = {
            passenger: this.props.passenger.passengerInfo
        }
    }


    render() {
        return (
            <View style={styles.container}>
                <TouchableWithoutFeedback onPress={() => this.props.onDrop(this.state.passenger.passengerId)}>
                    <View style={{
                        borderRadius: SIZES.radius - 5,
                        backgroundColor: COLORS.primary,
                        padding: SIZES.padding * 1.5,
                        marginTop: SIZES.margin,
                    }}>
                        <Text style={{
                            textAlign: 'center',
                            color: COLORS.white,
                            ...FONTS.h5
                        }}>{this.state.passenger.passengerName}</Text>
                    </View>
                </TouchableWithoutFeedback>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default PassengerList;
