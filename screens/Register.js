import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput } from 'react-native';

import { BackButton, ContiuneButton } from '../components';
import { COLORS, SIZES, FONTS } from '../constants';

class Register extends Component {
  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton navigation={this.props.navigation}></BackButton>
        <ContiuneButton navigation={this.props.navigation} buttonLabel="ถัดไป" to="Lobby"></ContiuneButton>
        <View style={{
          marginTop: SIZES.top
        }}>
          <Text style={{
            ...FONTS.h4
          }}>ชื่อ - นานสกุล</Text>
          <TextInput
            style={styles.inputName}
            onChangeText={this.handleOtp}
            placeholder="Helen Watt"
            keyboardType="default"
            autoFocus={true}
          />
          <Text style={{
            marginTop: SIZES.margin * 3,
            ...FONTS.h4
          }}>ที่อยู่อีเมล</Text>
          <Text style={{
            color: COLORS.lightGray,
            ...FONTS.body3
          }}>เราจะส่งอีเมลสำหรับยืนยันบัญชีให้คุณ</Text>
          <TextInput
            style={styles.inputEmail}
            onChangeText={this.handleOtp}
            placeholder="example@email.com"
            keyboardType="email-address"
          />
        </View>
      </SafeAreaView>
    );
  }
}

export default Register;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: COLORS.white,
  },
  inputName: {
    ...FONTS.h1
  },
  inputEmail: {
    marginTop: SIZES.margin * 6,
    ...FONTS.h1
  }
});
