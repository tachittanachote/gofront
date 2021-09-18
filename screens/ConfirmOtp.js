import React, { Component } from 'react';
import { SafeAreaView, Text, View, StyleSheet, TextInput } from 'react-native';
import { BackButton } from '../components';

import { COLORS, FONTS, SIZES } from '../constants';

class ConfirmOtp extends Component {

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

  handleOtp = (value) => {
    if (value.length === 6) {
      this.props.navigation.navigate("Register");
    }
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton navigation={this.props.navigation}></BackButton>
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
            onChangeText={this.handleOtp}
            placeholder="000000"
            keyboardType="number-pad"
            autoFocus={true}
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
