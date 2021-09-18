import React, { PureComponent } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback, Image, TextInput } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Geolocation from '@react-native-community/geolocation';
import { Icon } from 'react-native-elements';
import MapViewDirections from 'react-native-maps-directions'

import { getDeltaCoordinates, requestGeolocationPermission } from '../utils';
import { Preload, BackButton, Title, SuggestionPlace, HorizontalLine } from '../components';
import { COLORS, FONTS, GOOGLE_API_KEY, images, MAPS, SIZES } from '../constants';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import UserContext from '../context/UserProvider';


class DriverScreen extends PureComponent {

    static contextType = UserContext;

    constructor(props) {
        super(props);
        this.state = {
            coordinates: null,
            destination: null,
            marker: null,
            mapRef: null,
            mapViewDirection: null,
            nearbyPlace: [],
        }
    }

    componentDidMount = () => {
        requestGeolocationPermission().then((e) => {
            Geolocation.getCurrentPosition(
                (position) => {
                    this.getNearbyPlace(position.coords.latitude, position.coords.longitude);
                    this.setState({ coordinates: getDeltaCoordinates(position.coords.latitude, position.coords.longitude, position.coords.accuracy) });
                },
                (error) => {
                    console.log(error.code, error.message);
                },
                { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
        })
    }

    handleDestination(state) {
        this.setState({ destination: state }, () => {
            if (this.state.destination !== true && this.state.destination !== null) {

                var coordinate = {
                    latitude: state.geometry.location.lat,
                    longitude: state.geometry.location.lng,
                }

                this.setState({ marker: coordinate });

                setTimeout(() => {
                    this.state.mapRef.fitToCoordinates([coordinate, this.state.coordinates], {
                        animated: true,
                    });
                }, 100)

                this.setState({
                    mapViewDirection:
                        <MapViewDirections
                            origin={this.state.coordinates}
                            destination={coordinate}
                            apikey={GOOGLE_API_KEY}
                            strokeWidth={10}
                            strokeColor="#669df6"
                            optimizeWaypoints={true}
                            mode="DRIVING"
                            avoidHighways={true}
                        />
                })
            }
            if(this.state.destination === true) {
                
                axios.post('/location/place', {
                    coordinates: this.state.marker
                }).then((e) => {  

                    console.log("assgining")
                    
                    var coordinate = {
                        latitude: this.state.marker.latitude,
                        longitude: this.state.marker.longitude
                    }

                    Object.assign(coordinate, e.data); 

                    this.setState({ destination: coordinate })

                }).catch((e) => {
                    console.log(e)
                })
            }
        })
        if (!state) {
            this.setState({ mapViewDirection: null, marker: null, destination: null })
        }
    }

    handleMarker = (region) => {

        this.setState({ marker: region.coordinate }, () => {

            this.handleDestination(true);

            this.state.mapRef.fitToCoordinates([region.coordinate, this.state.coordinates], {
                edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
                animated: true,
            });
            this.setState({
                mapViewDirection:
                    <MapViewDirections
                        origin={this.state.coordinates}
                        destination={this.state.marker}
                        apikey={GOOGLE_API_KEY}
                        strokeWidth={10}
                        strokeColor="#669df6"
                        optimizeWaypoints={true}
                        mode="DRIVING"
                        avoidHighways={true}
                    />
            })
        })
    }

    getNearbyPlace = (latitude, longitude) => {
        axios.post("/location/nearby", {
            radius: 50000,
            coordinates: {
                latitude: latitude,
                longitude: longitude
            }
        }).then((e) => {

            var nearby = [
                e.data[e.data.length - 1],
                e.data[e.data.length - 2],
                e.data[e.data.length - 3]
            ]

            nearby.forEach((place) => {
                axios.post('/location/place', {
                    coordinates: {
                        latitude: place.geometry.location.lat,
                        longitude: place.geometry.location.lng
                    }
                }).then((e) => {

                    var placeAddress = Object.assign(place, e.data)
                    var nearbyPlace = this.state.nearbyPlace.concat(placeAddress);
                    this.setState({ nearbyPlace: nearbyPlace });

                }).catch((e) => {
                    console.log(e)
                })
            })

        }).catch((e) => {
            console.log(e)
        })
    }

    renderMapViewDirection() {
        return this.state.mapViewDirection;
    }

    handleStart = () => {
        
        axios.post("/cars/start", {
            driver: {
                id: this.context.user.id,
                name: this.context.user.first_name,
                currentLat: this.state.coordinates.latitude,
                currentLong: this.state.coordinates.longitude,
                destinationLat: this.state.destination?.latitude ? this.state.destination?.latitude : this.state.destination.geometry.location.lat,
                destinationLong: this.state.destination?.longitude ? this.state.destination.longitude : this.state.destination.geometry.location.lng,
                carInfo: {
                    registration: "AB123", //Context  
                    color: "Black",     //Context  
                    model: "BMW", //Context  
                    seat: 4 //Context  
                }
            }
        }).then((e) => {
            if(e.data === "success") {
                this.props.navigation.navigate("DrivingScreen")
            }
        }).catch((e) => {
            console.log(e)
        })
    }

    render() {
        return (
            <SafeAreaView style={{ flex: 1 }}>
                <BackButton navigation={this.props.navigation}></BackButton>
                {this.state.coordinates === null ?
                    <Preload></Preload>
                    :
                    <View style={{
                        flex: 1,
                    }}>
                        <MapView
                            style={{ flex: 2 }}
                            provider={PROVIDER_GOOGLE}
                            showsUserLocation={true}
                            initialRegion={this.state.coordinates}
                            region={!this.state.marker ? this.state.coordinates : this.state.marker.coodinates}
                            onPress={(e) => this.handleMarker(e.nativeEvent)}
                            onPoiClick={(e) => this.handleMarker(e.nativeEvent)}
                            ref={(ref) => { this.state.mapRef = ref }}
                            followsUserLocation={true}

                        >

                            {this.state.marker &&
                                <View>
                                    <Marker
                                        coordinate={this.state.marker}
                                        identifier={'marker'}
                                    >
                                        <Image source={images.marker_icon} style={{ ...MAPS.markerSize }}></Image>
                                    </Marker>
                                </View>
                            }

                            {this.renderMapViewDirection()}

                        </MapView>

                        {!this.state.destination ?

                            <View style={{
                                flex: 1,
                                width: '100%',
                                bottom: 0,
                                maxHeight: SIZES.height * (50 / 100),
                                backgroundColor: COLORS.white,
                                padding: SIZES.padding * 2.5
                            }}>

                                <Title title="เลือกจุดหมายปลายทาง"></Title>
                                <View style={{
                                    flexDirection: "row",
                                    width: '100%',
                                    paddingLeft: SIZES.padding * 1.5,
                                    paddingRight: SIZES.padding * 1.5,
                                    backgroundColor: COLORS.lightGray3,
                                    borderRadius: SIZES.radius,
                                    alignItems: 'center',
                                    marginBottom: 20,
                                }}>
                                    <Icon
                                        style={{
                                            marginRight: 15,
                                        }}
                                        name='map-marker-alt'
                                        type='font-awesome-5'
                                        color='#ED2026'
                                        size={28}
                                    />
                                    <TextInput
                                        style={{
                                            ...FONTS.h2
                                        }}
                                        placeholder="ค้นหาเส้นทาง "
                                    >
                                    </TextInput>
                                </View>

                                <ScrollView>
                                    {this.state.nearbyPlace.length !== 0 ?
                                        <View>
                                            {this.state.nearbyPlace.map((place, index) => (
                                                <View key={index}>
                                                    <View style={styles.tocuhable} onStartShouldSetResponder={() => this.handleDestination(place)}>
                                                        <SuggestionPlace placeLocation={place.name} placeAddress={place.formatted_address.split(",")[0]}></SuggestionPlace>
                                                    </View>
                                                    <HorizontalLine></HorizontalLine>
                                                </View>
                                            ))}

                                        </View>
                                        :
                                        <View style={{
                                            flex: 1,
                                            height: 150,
                                            justifyContent: 'center',
                                            alignItems: 'center',
                                            alignSelf: 'center',
                                        }}>
                                            <Text>กำลังค้นหาจุดหมาย</Text>
                                        </View>
                                    }
                                </ScrollView>
                            </View>

                            :

                            <View style={{
                                flex: 1,
                                width: '100%',
                                bottom: 0,
                                maxHeight: SIZES.height * (50 / 100),
                                backgroundColor: COLORS.white,
                                padding: SIZES.padding * 2.5,
                            }}>
                                <Title title="จุดหมายปลายทาง"></Title>
                                <View style={{
                                    flex: 1,
                                    flexDirection: 'row',
                                    alignItems: 'center',
                                    backgroundColor: COLORS.lightGray3,
                                    padding: SIZES.padding * 3,
                                    borderRadius: SIZES.radius
                                }}>
                                    <Icon
                                        style={{
                                            marginRight: 8,
                                        }}
                                        name='radio-button-on-outline'
                                        type='ionicon'
                                        color='#1296DB'
                                        size={28}
                                    />
                                    <View style={{
                                        flex: 1,
                                        flexDirection: 'column'
                                    }}>
                                        <Text style={{
                                            ...FONTS.h4
                                        }}>{this.state.destination.name}</Text>
                                        <Text style={{
                                            color: COLORS.lightGray2,
                                            ...FONTS.body4
                                        }}>{this.state.destination.formatted_address}</Text>
                                    </View>
                                </View>
                                <TouchableWithoutFeedback onPress={() => this.handleDestination(null)}>
                                    <View style={{
                                        borderRadius: SIZES.radius - 5,
                                        backgroundColor: COLORS.lightRed,
                                        padding: SIZES.padding * 1.5,
                                        marginTop: SIZES.margin,
                                    }}>
                                        <Text style={{
                                            textAlign: 'center',
                                            color: COLORS.red,
                                            ...FONTS.h5
                                        }}>ยกเลิก</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                                <TouchableWithoutFeedback onPress={() => this.handleStart()}>
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
                                        }}>เริ่มเดินทาง</Text>
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        }
                    </View>
                }
            </SafeAreaView>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.secondary,
    },
    tocuhable: {
        flex: 1,
        backgroundColor: "transparent",
    }
})

export default DriverScreen;
