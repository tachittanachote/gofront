import React, { Component } from 'react';
import { View, Text, StyleSheet, SafeAreaView, TouchableWithoutFeedback, Alert } from 'react-native';
import MapView, { PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';

import { PassengerList, Preload } from '../components';
import { COLORS, SIZES, FONTS } from '../constants';
import { getDeltaCoordinates, requestGeolocationPermission } from '../utils';
import { SwipeablePanel } from 'rn-swipeable-panel';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import UserContext from '../context/UserProvider';

class DrivingScreen extends Component {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            dashboardDisplay: "flex",
            coordinates: null,
            isPanelActive: false,
            panelProps: {
                fullWidth: true,
                onlySmall: true,
                onClose: () => this.closePanel(),
                onPressCloseButton: () => this.closePanel(),
            },
            passengers: []
        }
        this.checkPassengerInterval = null;
        this.pullInterval = null;
        this.dropPassenger = this.dropPassenger.bind(this);
    }

    componentDidMount = () => {

        this.checkPassengerInterval = setInterval(this.getPassengers, 5000);
        this.pullInterval = setInterval(this.pull, 5000);

        requestGeolocationPermission().then((e) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.setState({ coordinates: getDeltaCoordinates(position.coords.latitude, position.coords.longitude, position.coords.accuracy) });
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        })
    }

    openPanel = () => {
        this.setState({ isPanelActive: true, dashboardDisplay: "none" });
    };

    closePanel = () => {
        this.setState({ isPanelActive: false, dashboardDisplay: "flex" });
    };

    reachDestination = () => {
        axios.post("/cars/done", {
            carId: this.context.user.id
        }).then((e) => {
            if (e.data === "success") {
                this.props.navigation.navigate("Lobby")
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    dropPassenger = async (passengerId) => {

        var user = await axios.post("/user/" + passengerId);

        console.log("DropUserID", user.data),

        axios.post("/cars/dropPassenger", {
            carId: this.context.user.id,
            passenger: {
                id: passengerId,
                passengerName: user.data.first_name
            }
        }).then((e) => {
            if (e.data === "success") {
                Alert.alert("สำเร็จ")
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    renderContent() {

        console.log("render!")

        return (
            <View style={{
                padding: SIZES.padding
            }}>
                <ScrollView>
                    {this.state.passengers.length > 0 && this.state.passengers.map((passenger, index) => (
                        <PassengerList key={index} onDrop={(e) => this.dropPassenger(e)} passenger={passenger}></PassengerList>
                    ))
                    }
                    <TouchableWithoutFeedback onPress={() => this.reachDestination()}>
                        <View style={{
                            borderRadius: SIZES.radius - 5,
                            backgroundColor: COLORS.lightRed,
                            padding: SIZES.padding * 1.5,
                            marginTop: SIZES.margin,
                            marginBottom: SIZES.margin - 5,
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                color: COLORS.red,
                                ...FONTS.h5
                            }}>สิ้นสุดการเดืนทาง</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </ScrollView>
            </View>
        )
    }

    pull = () => {
        axios.post("/cars/pull", {
            carId: this.context.user.id
        }).then((e) => {
            console.log("pulled", e.data)
        }).catch((e) => {
            console.log("pulled", e)
        })
    }

    getPassengers = () => {
        axios.post('/cars/checkPassengersInfo', {
            driver: {
                id: this.context.user.id
            }
        }).then((e) => {
            this.setState(prevState =>{
                return{
                     ...prevState,
                     passengers : e.data
                }
             })
        }).catch((e) => {
            console.log(e)
        })
    }

    componentWillUnmount = () => {
        clearInterval(this.checkPassengerInterval);
        clearInterval(this.pullInterval);
    }

    render() {
        return (
            <SafeAreaView style={styles.container}>
                {this.state.coordinates === null ?
                    <Preload></Preload>
                    :
                    <View style={{
                        flex: 1,
                    }}>
                        <MapView
                            style={{ flex: 1 }}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            initialRegion={this.state.coordinates}
                            region={this.state.coordinates}
                        ></MapView>

                        <View
                            onStartShouldSetResponder={() => this.openPanel()}
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                width: '100%',
                                height: SIZES.height * (7.5 / 100),
                                backgroundColor: COLORS.white,
                                borderTopLeftRadius: SIZES.radius,
                                borderTopRightRadius: SIZES.radius,
                                padding: SIZES.padding,
                                alignItems: 'center',
                                display: this.state.dashboardDisplay,
                            }}>
                            <View style={{
                                width: SIZES.width * (10 / 100),
                                height: 5,
                                backgroundColor: COLORS.lightGray3,
                                borderRadius: SIZES.radius,
                            }}>
                            </View>
                            <Text style={{
                                padding: SIZES.padding,
                                color: COLORS.lightGray2,
                                textAlignVertical: 'center',
                                ...FONTS.h4
                            }}>
                                ข้อมูลการเดินทาง
                            </Text>
                        </View>
                        <SwipeablePanel {...this.state.panelProps} isActive={this.state.isPanelActive}>
                            {this.renderContent()}
                        </SwipeablePanel>
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
})

export default DrivingScreen;