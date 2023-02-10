import React, { useState, useEffect, useRef } from 'react';
import { AppState } from 'react-native';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/lib/integration/react';
import auth from '@react-native-firebase/auth';
import PushNotification from '@react-native-community/push-notification-ios';
import MainApp from './screens/MainApp';
import { persistor, store } from './store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FCMService from './service/firebase_messaging';
import FirebaseUser from './service/firebase_requests/User';
import User from './service/firebase_requests/User';

const App = () => {
    const appState = useRef(AppState.currentState);
    const [appStateVisible, setAppStateVisible] = useState(appState.current);

    useEffect(() => {
        AppState.addEventListener('change', _handleAppStateChange);

        return () => {
            AppState.removeEventListener('change', _handleAppStateChange);
        };
    }, []);

    const _handleAppStateChange = (nextAppState) => {
        if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
            PushNotification.setApplicationIconBadgeNumber(0);
            auth().currentUser && FirebaseUser.resetUserBadge();
        }

        appState.current = nextAppState;
        setAppStateVisible(appState.current);
    };

    useEffect(() => {
        FCMService.registerAppWithFCM();
        if (auth().currentUser) {
            User.updateUserSessionCount();
            FCMService.requestUserPermission();
        }
    }, []);

    useEffect(() => {
        PushNotification.setApplicationIconBadgeNumber(0);
        return () => PushNotification.setApplicationIconBadgeNumber(0);
    }, []);

    return (
        <Provider store={store}>
            <PersistGate persistor={persistor}>
                <SafeAreaProvider>
                    <MainApp />
                </SafeAreaProvider>
            </PersistGate>
        </Provider>
    );
};

export default App;
