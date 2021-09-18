import React, { Component } from 'react';
import { CardStyleInterpolators, createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import SplashScreen from "react-native-splash-screen";

import {
  Home,
  Login,
  Register,
  RequestOtp,
  ConfirmOtp,
  Lobby,
  Profile,
  DriverScreen,
  PassengerScreen,
  WaitScreen,
  TravelScreen,
  DrivingScreen,
} from './screens';
import { UserProvider } from './context';

const Stack = createStackNavigator();

class App extends Component {

  componentDidMount() {
    SplashScreen.hide();
  }

  render() {
    return (
      <UserProvider>
        <NavigationContainer>
          <Stack.Navigator
            screenOptions={{
              headerShown: false,
              cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS
            }}
            initialRouteName="Lobby">
            <Stack.Screen name="Home" component={Home} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
            <Stack.Screen name="RequestOtp" component={RequestOtp} />
            <Stack.Screen name="ConfirmOtp" component={ConfirmOtp} />
            <Stack.Screen name="Lobby" component={Lobby} />
            <Stack.Screen name="Profile" component={Profile} />
            <Stack.Screen name="DriverScreen" component={DriverScreen} />
            <Stack.Screen name="PassengerScreen" component={PassengerScreen} />
            <Stack.Screen name="WaitScreen" component={WaitScreen} />
            <Stack.Screen name="TravelScreen" component={TravelScreen} />
            <Stack.Screen name="DrivingScreen" component={DrivingScreen} />
          </Stack.Navigator>
        </NavigationContainer>
      </UserProvider>
    );
  }
}

export default App;
