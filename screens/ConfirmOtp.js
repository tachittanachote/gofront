import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput } from 'react-native';
import { BackButton } from '../components';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { COLORS, FONTS, SIZES } from '../constants';
import axios from 'axios';
class ConfirmOtp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      attempt: 0,
      inputOtp: null
    }
    this.textReference = null
  }

  renderRequest() {
    return (
      <View>
        {/* ยังไม่ได้รับใช่ไหม */}
        {/* ส่งคำขอรหัสใหม่ */}
        {/* ส่งคำขอรหัสใหม่ ภายใน 0:17 */}
      </View>
    )
  }

  // คุณได้กรอกรหัสผิดไปแล้ว 3 ครั้ง

  handleOtp = async (value) => {
    this.setState({ inputOtp: value })
    if (value.length === 6) {
      axios.post('/otp/verify', {
        code: value, reference_code: await AsyncStorage.getItem("referenceCode")
      },
        {
          headers:
            { authorization: "Bearer " + await AsyncStorage.getItem("device_token") }
        })
        .then((e) => {
          if (e.data.status === "success") {
            if (e.data.isNewUser !== undefined && e.data.isNewUser === true) {
              this.props.navigation.navigate('Register')
            } else {
              this.props.navigation.navigate("Lobby")
            }
          } else {
            console.log("not success")
            this.textReference.clear()
            this.setState({ attempt: this.state.attempt + 1 }, () => {
            console.log(this.state.attempt)
              if (this.state.attempt > 3) {
                this.props.navigation.navigate('Home')
              }
            }
            )
          }


        }).catch((e) => {
          console.log(e)
        })
      //this.props.navigation.navigate("Register");
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        {/*  <BackButton navigation={this.props.navigation}></BackButton> */}
        <View
          style={{
            marginTop: SIZES.margin * 3,
            padding: SIZES.padding - 10,
          }}>
          <Text
            style={{
              ...FONTS.body2,
            }}>
            ใส่รหัส 6 หลักส่งไปยัง
          </Text>
          <Text
            style={{
              ...FONTS.h4,
            }}>
            0988888888
          </Text>
          <TextInput
            style={styles.input}
            value={this.state.inputOtp}
            maxLength={6}
            onChangeText={this.handleOtp}
            placeholder="000000"
            keyboardType="number-pad"
            autoFocus={true}
            ref={input => { this.textReference = input }}
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default ConfirmOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.white,
  },
  input: {
    marginTop: SIZES.margin * 5,
    ...FONTS.h1
  }
});
