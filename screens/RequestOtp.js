import React, { Component } from 'react';
import {
  SafeAreaView,
  Text,
  View,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import { BackButton } from '../components';
import { COLORS, SIZES, FONTS } from '../constants';

class RequestOtp extends Component {

  constructor(props) {
    super(props);
    this.state = {
      errorMessage: [
        "เบอร์โทรศัพท์ไม่ถูกต้อง",
        "ใส่หมายเลขโทรศัพท์มือถือของคุณ"
      ]
    }
  }

  renderConfirmButton() {
    return (
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          padding: SIZES.padding * 2,
        }}>
        <TouchableWithoutFeedback
          onPress={() => this.props.navigation.navigate('ConfirmOtp')}>
          <View
            style={{
              flex: 1,
              width: '100%',
              padding: SIZES.padding * 1.75,
              borderRadius: SIZES.radius,
              backgroundColor: COLORS.primary,
            }}>
            <Text
              style={{
                flex: 1,
                textAlign: 'center',
                color: COLORS.white,
                ...FONTS.h4,
              }}>
              ยืนยัน
            </Text>
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <BackButton navigation={this.props.navigation}></BackButton>
        <View
          style={{
            marginTop: SIZES.top,
            padding: SIZES.padding * 2,
          }}>
          <Text
            style={{
              marginBottom: SIZES.margin,
              ...FONTS.h3,
            }}>
            ยินดีตอนรับ! เบอร์โทรศัพท์ของคุณเบอร์อะไร?
          </Text>
          <Text
            style={{
              ...FONTS.body3,
            }}>
            คุณจำเป็นต้องมีเบอร์โทรศัพท์ เพื่อเข้าถึงการเดินทางและบริการอื่นๆ
            ของเรา
          </Text>
          <TextInput
            style={styles.input}
            placeholder="098 888 8888"
            keyboardType="number-pad"
            autoFocus={true}
          />
          <Text style={{
            color: COLORS.red,
            marginTop: SIZES.margin - 10,
            ...FONTS.body2
          }}>เบอร์โทรศัพท์ไม่ถูกต้อง</Text>
        </View>
        {this.renderConfirmButton()}
      </SafeAreaView>
    );
  }
}

export default RequestOtp;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  input: {
    borderWidth: 1,
    borderRadius: SIZES.radius2,
    borderColor: COLORS.lightGray2,
    marginTop: SIZES.margin * 1.5,
    padding: 10,
    ...FONTS.h1,
  },
});
