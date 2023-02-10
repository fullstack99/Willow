import PushNotification from 'react-native-push-notification';
import PushNotificationIOS from '@react-native-community/push-notification-ios';
import { Platform } from 'react-native';

class LocalNotificationService {
    configure = (onOpenNotification) => {
        PushNotification.configure({
            onRegister: (token) => {
                console.log('[LocalNotificationService] onRegister: ', token);
            },
            onNotification: (notification) => {
                console.log('[LocalNotificationService]: onNotification: ', notification);
                if (!notification.data) {
                    return;
                }
                notification.userInteraction = true;
                // onOpenNotification(notification.data);

                if (Platform.OS === 'ios') {
                    // (Required) Called when a remote is received or opened, or local notification is opened
                    notification.finish(PushNotificationIOS.FetchResult.NoData);
                }
            },

            // IOS ONLY (optional): default: all - Permissions to register
            permissions: {
                alert: true,
                badge: true,
                sound: true,
            },

            // Should the initial notification be popped automatically
            popInitialNotification: true,

            // default: true
            // if not, you must call PushNotificaiton.requestPermission()
            requestPermissions: false,
        });
    };

    unregister = () => {
        PushNotification.unregister();
    };

    showNotification = (id, title, message, data = {}, options = {}) => {
        PushNotification.localNotification({
            /* Android Only Properties */
            ...this.buildAndroidNotification(id, title, message, data, options),
            /* iOS and Android properties */
            ...this.buildIOSNotification(id, title, message, data, options),
            /* iOS and Android properties */
            title: title || '',
            message: message || '',
            playSound: options.playSound || false,
            soundName: options.soundName || 'default',
            userInteraction: false,
        });
    };

    buildAndroidNotification = (id, title, message, data = {}, options = {}) => {
        return {
            id,
            autoCancel: true,
            largeIcon: options.largeIcon || 'ic_launcher',
            smallIcon: options.smallIcon || 'ic_notification',
            bigText: message || '',
            subText: title || '',
            vibrate: options.vibrate || true,
            vibration: options.vibration || 300,
            priority: options.priority || 'high',
            importance: options.importance || 'high',
            data,
        };
    };

    buildIOSNotification = (id, title, message, data = {}, options = {}) => {
        return {
            alertAction: options.alertAction || 'view',
            category: options.category || '',
            userInfo: {
                id,
                item: data,
            },
        };
    };

    cancelAllLocatNotification = () => {
        if (Platform.OS === 'ios') {
            PushNotificationIOS.removeAllDeliveredNotifications();
        } else {
            PushNotification.cancelAllLocalNotifications();
        }
    };

    removeDeliveredNotificationByID = (notificationID) => {
        console.log('[LocalNotificationService] removeDeliveredNotificationByID: ', notificationID);
        PushNotification.cancelLocalNotifications({ id: `${notificationID}` });
    };
}

export default new LocalNotificationService();
