import { Platform } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import PushNotification from '@react-native-community/push-notification-ios';
import FirebaseUser from './firebase_requests/User';
import * as DATABASE_CONSTANTS from '../constants/Database';
import * as USER_CONSTANTS from '../constants/User';

class FCMService {
    registerAppWithFCM = async () => {
        try {
            if (Platform.OS === 'ios') {
                await messaging().registerDeviceForRemoteMessages();
                if (!messaging().isAutoInitEnabled) {
                    console.log('[FCMService] Cloud Messaging AuthInit is disabled');
                    await messaging().setAutoInitEnabled(true);
                }
            }
        } catch (error) {
            console.log(error);
        }
    };
    requestUserPermission = async () => {
        try {
            if (!auth().currentUser) throw 'User has not been authenticated yet.';
            let authStatus = await messaging().hasPermission();
            if (authStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
                authStatus = await messaging().requestPermission();
            }

            if (
                authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
                authStatus === messaging.AuthorizationStatus.PROVISIONAL
            ) {
                const fcmToken = await messaging().getToken();
                console.log(`[FCM Token]: ${fcmToken}`);
                if (fcmToken) {
                    const userDocument = await firestore().collection(DATABASE_CONSTANTS.USER).doc(auth().currentUser.uid).get();
                    if (userDocument.exists) {
                        await firestore()
                            .collection(DATABASE_CONSTANTS.USER)
                            .doc(auth().currentUser.uid)
                            .update({
                                fcmTokens: firestore.FieldValue.arrayUnion(fcmToken),
                            });
                    }
                }
                return authStatus;
            }
        } catch (error) {
            throw error;
        }
    };

    register = async (onRegister, onNotification, onOpenNotification, navigateTo) => {
        // this.getToken(onRegister);
        this.createNotificationListeners(onRegister, onNotification, onOpenNotification, navigateTo);
    };

    createNotificationListeners = (onRegister, onNotification, onOpenNotification, navigateTo) => {
        // When the application is running, but in the background
        messaging().onNotificationOpenedApp((remoteMessage) => {
            console.log('[FCMService] onNotificationOpenedApp Notification caused app to open from background');
            PushNotification.setApplicationIconBadgeNumber(0);
            auth().currentUser && FirebaseUser.resetUserBadge();
            if (remoteMessage) {
                onOpenNotification(remoteMessage, navigateTo);
            }
        });

        // When the application is opened from a quit state
        messaging()
            .getInitialNotification()
            .then((remoteMessage) => {
                console.log('[FCMService] getInitialNotification Notification caused app to open from quit state');
                PushNotification.setApplicationIconBadgeNumber(0);
                auth().currentUser && FirebaseUser.resetUserBadge();
                if (remoteMessage) {
                    onOpenNotification(remoteMessage, navigateTo);
                }
            });

        // Foreground state messages
        this.messageListener = messaging().onMessage(async (remoteMessage) => {
            console.log('[FCMService] A new FCM message arrived!', remoteMessage);
            PushNotification.setApplicationIconBadgeNumber(0);
            if (remoteMessage) {
                let notification = null;
                if (Platform.OS === 'ios') {
                    notification = remoteMessage.data.notification || remoteMessage.notification;
                } else {
                    notification = remoteMessage.notification;
                }
                onNotification(notification);
            }
        });

        // Triggered when have new token
        messaging().onTokenRefresh((fcmToken) => {
            console.log('[FCMService] New token refresh: ', fcmToken);
            onRegister(fcmToken);
        });
    };

    unRegister = () => {
        this.messageListener && this.messageListener();
    };

    registerCurrentDeviceFCMToken = () => {
        return new Promise((resolve, reject) => {
            if (auth().currentUser) {
                messaging()
                    .getToken()
                    .then((fcmToken) => {
                        firestore()
                            .collection(DATABASE_CONSTANTS.USER)
                            .doc(auth().currentUser.uid)
                            .update({
                                [USER_CONSTANTS.FCMTOKENS]: firestore.FieldValue.arrayUnion(fcmToken),
                            })
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    })
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            } else {
                resolve();
            }
        });
    };
}

export default new FCMService();
