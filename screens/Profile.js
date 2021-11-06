import React, { Component } from 'react';
import { ScrollView, SafeAreaView, StyleSheet, Text, View, TouchableWithoutFeedback, TextInput } from 'react-native';
import { Picker } from "@react-native-picker/picker"
import moment from 'moment';
import axios from 'axios';
import { Icon } from 'react-native-elements';
import { CircleMenu } from '../components';
import DatePicker from 'react-native-date-picker'
import { SIZES, COLORS, FONTS } from '../constants';
import { UserContext } from '../context';
import AsyncStorage from '@react-native-async-storage/async-storage';
import validator from 'validator'

class Profile extends Component {

    static contextType = UserContext;
    constructor(props) {
        super(props)
        this.state = {
            editState: false,
            first_name: null,
            last_name: null,
            email: null,
            phone_number: null,
            emergency_phone_number,
            gender: null,
            date_of_birth: null,
            date_picker_state: false,
            emailErrorText: null,
            phoneNumberErrorText: null,
            emergencyPhoneNumberErrorText: null
        }


    }

    setDefaultUserProfile = async () => {
        axios.post('/profile', {
            user: { user_id: this.context.user.user_id }
        }, {
            headers: {
                authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
            }
        }).then((e) => {
            console.log(e)
            var profile = e.data
            this.setState({
                editState: true,
                first_name: profile.first_name,
                last_name: profile.last_name,
                email: profile.email,
                phone_number: profile.phone_number,
                gender: profile.gender,
                date_of_birth: profile.date_of_birth,
                emergency_phone_number: profile.emergency_phone_number
            })
        }).catch((e) => {
            console.log(e)
        })


    }

    updateUserInfo = async () => {
        var correct = true;
        var correctEmail = true;
        var correctPhoneNumber = true;
        var correctEmergencyPhoneNumber = true;

        if (this.state.first_name === null || this.state.first_name === "") this.setState({ first_name: this.context.user.first_name }); correct = false
        if (this.state.last_name === null || this.state.last_name === "") this.setState({ last_name: this.state.last_name }); correct = false

        if (!validator.isEmail(this.state.email)) { this.setState({ emailErrorText: "please enter new email with correct format" }); correctEmail = false; correct = false }
        if (validator.isEmail(this.state.email)) { correctEmail = true; this.setState({ emailErrorText: null }) }

        if (this.state.phone_number.length !== 10 || this.state.phone_number.charAt(0) !== "0") { this.setState({ phoneNumberErrorText: "please start with 0 or make sure it is 10 digits" }); correctPhoneNumber = false; correct = false }
        if (!(this.state.phone_number.length !== 10 || this.state.phone_number.charAt(0) !== "0")) { correctPhoneNumber = true; correct = true; this.setState({ phoneNumberErrorText: null }) }

        if (this.state.emergency_phone_number.length != 0) {
            if (this.state.emergency_phone_number.length !== 10 || this.state.emergency_phone_number.charAt(0) !== "0") { this.setState({ emergencyPhoneNumberErrorText: "please start with 0 or make sure it is 10 digits" }); correctEmergencyPhoneNumber = false; correct = false }
            if (!(this.state.emergency_phone_number.length !== 10 || this.state.emergency_phone_number.charAt(0) !== "0")) { correctEmergencyPhoneNumber = true; correct = true; this.setState({ emergencyPhoneNumberErrorText: null }) }
        }
        if (this.state.gender === null || this.state.gender === "") this.setState({ gender: this.context.user.gender }); correct = false
        if (this.state.date_of_birth === null || this.state.date_of_birth === "") this.setState({ date_of_birth: this.context.user.date_of_birth }); correct = false

        if (!(this.state.first_name === null || this.state.first_name === "") && !(this.state.last_name === null || this.state.last_name === "")
            && correctEmail === true && correctPhoneNumber === true && !(this.state.gender === null || this.state.gender === "")
            && !(this.state.date_of_birth === null || this.state.date_of_birth === "")) {
            correct = true
        }

        console.log(correct, "phoneNumber:", correctPhoneNumber, "email:", correctEmail,)

        if (correct === true & correctPhoneNumber === true & correctEmail === true & correctEmergencyPhoneNumber === true) {
            axios.post('/profile/update', {
                user: {
                    user_id: this.context.user.user_id,
                    first_name: this.state.first_name,
                    last_name: this.state.last_name,
                    email: this.state.email,
                    phone_number: this.state.phone_number,
                    gender: this.state.gender,
                    date_of_birth: this.state.date_of_birth,
                    emergency_phone_number: this.state.emergency_phone_number
                }
            }, {
                headers: {
                    authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                }
            }).then((e) => {
                if (e.data === 'success') {
                    //console.log(this.context)
                    this.context.updateContext()
                    this.setState({ editState: false })
                } else {
                    alert("error, something went wrong")
                }

            }).catch((e) => {
                console.log(e)
            })


        }
    }

    handleProfileEdit = async () => {
        console.log("edit")
        if (this.state.editState === false) {
            axios.post('/profile', {
                user: { user_id: this.context.user.user_id }
            }, {
                headers: {
                    authorization: 'Bearer ' + await AsyncStorage.getItem('session_token')
                }
            }).then((e) => {
                console.log(e.data)
                var profile = e.data
                this.setState({
                    editState: true,
                    first_name: profile.first_name,
                    last_name: profile.last_name,
                    email: profile.email,
                    phone_number: profile.phone_number,
                    gender: profile.gender,
                    date_of_birth: profile.date_of_birth,
                    emergency_phone_number: emergency_phone_number

                })
            }).catch((e) => {
                console.log(e)
            })
        } else {
            this.setState({ editState: false })
            console.log("false")
        }
    }

    handleLogout() {
        AsyncStorage.getAllKeys()
            .then(keys => AsyncStorage.multiRemove(keys))
            .then(() => {
                this.props.navigation.navigate("Home")
            });

    }


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
                <ScrollView>
                    <View style={{
                        flex: 1,
                        alignItems: 'center',
                        paddingBottom: '20%'
                    }}>
                        <View style={{
                            marginTop: SIZES.margin * 2,
                            marginBottom: SIZES.margin * 2,
                        }}>
                            {!this.state.editState ?

                                <>
                                    <Text style={styles.info}>หมายเลขผู้ใช้งาน {this.context.user.user_id}</Text>
                                    <Text style={styles.info}>{this.state.first_name === null ? this.context.user.first_name : this.state.first_name}</Text>
                                    <Text style={styles.info}>{this.state.last_name === null ? this.context.user.last_name : this.state.last_name}</Text>
                                    <Text style={styles.info}>{this.state.email === null ? this.context.user.email : this.state.email}</Text>
                                    <Text style={styles.info}>{this.state.phone_number === null ? this.context.user.phone_number : this.state.phone_number}</Text>
                                    <Text style={styles.info}>{this.state.emergency_phone_number === null ? this.context.emergency_phone_number : this.state.emergency_phone_number}</Text>
                                    <Text style={styles.info}>เพศ {this.state.gender === null ? this.context.user.gender : this.state.gender}</Text>
                                    <Text style={styles.info}>วันเกิด {this.state.date_of_birth === null ? this.context.user.date_of_birth : this.state.date_of_birth}</Text>
                                </>

                                :
                                <>
                                    <TextInput
                                        style={styles.info}
                                        onChangeText={(text) => this.setState({ first_name: text })}
                                        value={this.state.first_name}
                                        placeholder="name"
                                        keyboardType="default"
                                    />
                                    <TextInput
                                        style={styles.info}
                                        onChangeText={(text) => this.setState({ last_name: text })}
                                        value={this.state.last_name}
                                        placeholder="last name"
                                        keyboardType="default"
                                    />
                                    <TextInput
                                        style={styles.info}
                                        onChangeText={(text) => this.setState({ email: text })}
                                        value={this.state.email}
                                        placeholder="email"
                                        keyboardType="default"
                                    />
                                    <Text style={{
                                        color: COLORS.red,
                                        marginBottom: SIZES.marginBottom,
                                        ...FONTS.body3
                                    }}>{this.state.emailErrorText}</Text>
                                    <TextInput
                                        style={styles.info}
                                        onChangeText={(text) => this.setState({ phone_number: text })}
                                        value={this.state.phone_number}
                                        placeholder="phone number"
                                        keyboardType="default"
                                    />
                                    <Text style={{
                                        color: COLORS.red,
                                        marginBottom: SIZES.marginBottom,
                                        ...FONTS.body3
                                    }}>{this.state.phoneNumberErrorText}</Text>
                                    <TextInput
                                        style={styles.info}
                                        onChangeText={(text) => this.setState({ emergency_phone_number: text })}
                                        value={this.state.emergency_phone_number}
                                        placeholder="emergency phone number"
                                        keyboardType="default"
                                    />
                                    <Text style={{
                                        color: COLORS.red,
                                        marginBottom: SIZES.marginBottom,
                                        ...FONTS.body3
                                    }}>{this.state.emergencyPhoneNumberErrorText}</Text>
                                    <View style={styles.info}>
                                        <Picker
                                            selectedValue={this.state.gender}
                                            style={{ textAlign: "center", height: 50, width: "100%" }}
                                            onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue })}
                                        >
                                            <Picker.Item label="ชาย" value="male" />
                                            <Picker.Item label="หญิง" value="female" />
                                        </Picker>
                                    </View>
                                    <DatePicker
                                        modal
                                        mode="date"
                                        open={this.state.date_picker_state}
                                        date={new Date()}
                                        onConfirm={(date) => {
                                            this.setState({ date_picker_state: false, date_of_birth: moment(date).format('YYYY-MM-DD') })
                                        }}
                                        onCancel={() => {
                                            this.setState({ date_picker_state: false })
                                        }}
                                    />
                                    <TouchableWithoutFeedback onPress={() => this.setState({ date_picker_state: true })}>
                                        <Text style={styles.info}>วันเกิด {this.state.date_of_birth}</Text>
                                    </TouchableWithoutFeedback>

                                </>
                            }
                        </View>
                        {!this.state.editState ?
                            <TouchableWithoutFeedback onPress={this.handleProfileEdit}>
                                <View style={{
                                    borderRadius: SIZES.radius - 5,
                                    backgroundColor: COLORS.secondary,
                                    padding: SIZES.padding * 1.5,
                                    marginTop: SIZES.margin,
                                    width: SIZES.width * (70 / 100),
                                }}>

                                    <Text style={{
                                        textAlign: 'center',
                                        color: COLORS.primary,
                                        ...FONTS.h5
                                    }}>แก้ไขข้อมูลส่วนตัว</Text>
                                </View>
                            </TouchableWithoutFeedback>
                            :
                            <TouchableWithoutFeedback onPress={this.updateUserInfo}>
                                <View style={{
                                    borderRadius: SIZES.radius - 5,
                                    backgroundColor: COLORS.primary,
                                    padding: SIZES.padding * 1.5,
                                    marginTop: SIZES.margin,
                                    width: SIZES.width * (70 / 100),
                                }}>

                                    <Text style={{
                                        textAlign: 'center',
                                        color: COLORS.white,
                                        ...FONTS.h5
                                    }}>บันทึกข้อมูล</Text>
                                </View>
                            </TouchableWithoutFeedback>
                        }
                        <TouchableWithoutFeedback onPress={() => this.handleLogout()}>
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
                </ScrollView>
            </SafeAreaView>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.white,
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