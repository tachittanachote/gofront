import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback } from 'react-native';
import { Icon } from 'react-native-elements';
import { CircleMenu } from '../components';

import { SIZES, COLORS, FONTS } from '../constants';
import { UserContext } from '../context';

class Profile extends Component {
    
    static contextType = UserContext;

    render() {
        return (
            <SafeAreaView style={styles.container}>
                <View style={{
                    top: 0,
                    height: SIZES.height * (25 / 100),
                    position: 'absolute',
                    width: '100%',
                    elevation: 10,
                    paddingLeft: 20,
                }}>
                    <View style={{
                        flex: 1,
                        flexDirection: 'row',
                        alignItems: 'center',
                    }}>
                        <View style={{
                            marginRight: 10,
                            justifyContent: 'center'
                        }}>
                            <Icon
                                name="person-circle-outline"
                                type='ionicon'
                                color={COLORS.white}
                                size={SIZES.width * (15 / 100)}
                            />
                        </View>
                        <View style={{
                            justifyContent: 'center'
                        }}>
                            <Text style={{
                                color: COLORS.white,
                                ...FONTS.h3
                            }}>บัญชีของคุณ</Text>
                            <Text style={{
                                color: COLORS.white,
                                ...FONTS.body3
                            }}>สวัสดีคุณ {this.context.user.first_name}</Text>
                        </View>
                    </View>
                </View>
                <View style={styles.headerBackground}>
                    <CircleMenu navigation={this.props.navigation} iconName="close-outline" to="Lobby"></CircleMenu>
                </View>
                <View style={{
                    flex: 1,
                    alignItems: 'center'
                }}>
                    <View style={{
                        marginTop: SIZES.margin * 2,
                        marginBottom: SIZES.margin * 2,
                    }}>
                        <Text style={styles.info}>หมายเลขผู้ใช้งาน {this.context.user.id}</Text>
                        <Text style={styles.info}>{this.context.user.first_name}</Text>
                        <Text style={styles.info}>{this.context.user.email}</Text>
                        <Text style={styles.info}>{this.context.user.phone_number}</Text>
                    </View>

                    <TouchableWithoutFeedback onPress={() => this.props.navigation.navigate("Home")}>
                        <View style={{
                            borderRadius: SIZES.radius - 5,
                            backgroundColor: COLORS.lightRed,
                            padding: SIZES.padding * 1.5,
                            marginTop: SIZES.margin,
                            width: SIZES.width * (70 / 100),
                        }}>
                            <Text style={{
                                textAlign: 'center',
                                color: COLORS.red,
                                ...FONTS.h5
                            }}>ออกจากระบบ</Text>
                        </View>
                    </TouchableWithoutFeedback>
                </View>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white
    },
    headerBackground: {
        height: SIZES.height * (25 / 100),
        backgroundColor: COLORS.primary,
        paddingBottom: SIZES.padding * 3,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2
        },
        shadowOpacity: 0.25,
        shadowRadius: 4,
        elevation: 5
    },
    info: {
        backgroundColor: COLORS.lightGray3,
        textAlign: 'center',
        padding: SIZES.padding * 2,
        width: SIZES.width * (85 / 100),
        borderRadius: SIZES.radius,
        marginBottom: 10,
        ...FONTS.body3,
    }
})

export default Profile;