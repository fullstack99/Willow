import React from 'react';
import { AppRegistry, StatusBar, LogBox } from 'react-native';
import App from './src/App';
import { name as appName } from './app.json';
import axios from 'axios';
import firebase from '@react-native-firebase/app';
import moment from 'moment';
import messaging from '@react-native-firebase/messaging';
import { locale, relativeTime } from './src/service/moment_locale';
import { PRODUCTION_SERVER_ID, DEVELOPMENT_SERVER_ID } from './src/config';

if (!firebase.app() || !firebase.app()._initialized) {
    console.log('Firebase Connection Error. Please restart the app');
}
// Fixed Dark Mode (for now)
StatusBar.setBarStyle('dark-content');

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
    console.log('Message handled in the background!', remoteMessage);
});

// Configure axios default baseURL
if (firebase.app().options.projectId === PRODUCTION_SERVER_ID) {
    axios.defaults.baseURL = `https://us-central1-${PRODUCTION_SERVER_ID}.cloudfunctions.net/willow`;
} else {
    axios.defaults.baseURL = `https://us-central1-${DEVELOPMENT_SERVER_ID}.cloudfunctions.net/willowdev`;
    // axios.defaults.baseURL = `http://localhost:5001/willow-development-85aca/us-central1/willowdev`;
}

moment.locale(locale);
moment.updateLocale(locale, {
    relativeTime,
});

LogBox.ignoreLogs([
    'Non-serializable values were found in the navigation state',
    `Usage of "messaging().registerDeviceForRemoteMessages()" is not required.`,
    `Require cycle:`,
]);

const HeadlessCheck = ({ isHeadless }) => {
    if (isHeadless) {
        return null;
    }
    return <App />;
};

AppRegistry.registerComponent(appName, () => HeadlessCheck);
// AppRegistry.registerHeadlessTask('ReactNativeFirebaseMessagingHeadlessTask');
