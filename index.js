/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import {name as appName} from './app.json';

import axios from 'axios';

axios.defaults.baseURL = 'http://172.20.10.9:3000/api/v1';

AppRegistry.registerComponent(appName, () => App);
