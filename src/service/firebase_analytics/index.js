import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import * as USER_CONSTANTS from '../../constants/User';
import * as ERROR_CONSTANTS from '../firebase_errors/constants';
import * as ANALYTICS_CONSTANTS from '../../constants/Analytics';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';

class FirebaseAnalytics {
    configure = (user) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser || !user.uid || !user.username || !user.name) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }

            return analytics()
                .setAnalyticsCollectionEnabled(true)
                .then(() => {
                    Promise.all([
                        analytics().setUserId(auth().currentUser.uid),
                        analytics().setUserProperties({
                            [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
                            [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                        }),
                    ])
                        .then(() => {
                            analytics()
                                .logLogin({ method: 'phone' })
                                .then(resolve)
                                .catch((error) => {
                                    console.log('[Analytics Error]:', error);
                                    reject(error);
                                    return;
                                });
                        })
                        .catch((error) => {
                            console.log('[Analytics Error]:', error);
                            reject(error);
                            return;
                        });
                });
        });
    };

    logSignOut = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }

            return Promise.all([
                analytics().logEvent(ANALYTICS_CONSTANTS.SIGNOUT, { uid: auth().currentUser.uid }),
                analytics().setUserId(null),
                analytics().setUserProperties({
                    [USER_CONSTANTS.USERNAME]: null,
                    [USER_CONSTANTS.NAME]: null,
                }),
            ])
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    reject(error);
                    return;
                });
        });
    };

    logScreen = (screen_name) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                resolve();
                return;
            }

            let screen_class = 'app';

            switch (screen_name) {
                case NAVIGATOR_CONSTANTS.LOGIN:
                case NAVIGATOR_CONSTANTS.START_UP:
                case NAVIGATOR_CONSTANTS.SIGNUP_I:
                case NAVIGATOR_CONSTANTS.SIGNUP_II:
                case NAVIGATOR_CONSTANTS.TURN_ON_NOTIFICATIONS:
                    screen_class = 'auth';
                    break;
                default:
                    break;
            }

            return analytics()
                .logScreenView({ screen_class, screen_name })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    reject(error);
                    return;
                });
        });
    };

    logShoppingBagClick = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                resolve();
                return;
            }

            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.SHOPPING_BAG_CLICK, { uid: auth().currentUser.uid })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    reject(error);
                    return;
                });
        });
    };

    logFollowing = (follower_id) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser || !follower_id) {
                resolve();
                return;
            }

            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.FOLLOWING, { follower_id })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    reject(error);
                    return;
                });
        });
    };

    logSignUpClick = () => {
        return new Promise((resolve, reject) => {
            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.ON_SIGNUP_CLICK)
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logMessageSent = (message_id) => {
        return new Promise((resolve, reject) => {
            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.MESSAGE_SENT, { messageID: message_id })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logStatusReminderClick = () => {
        return new Promise((resolve, reject) => {
            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.STATUS_REMINDER, { uid: auth().currentUser?.uid || null })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logFeedbackReminderClick = () => {
        return new Promise((resolve, reject) => {
            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.FEEDBACK_REMINDER, { uid: auth().currentUser?.uid || null })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logAmazonItemClick = (asin) => {
        return new Promise((resolve, reject) => {
            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.AMAZON_ITEM_CLICK, { asin })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logSavedProduct = (asin) => {
        return new Promise((resolve, reject) => {
            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.SAVED_PRODUCT, { asin })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logCreatePrivateMessage = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }

            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.CREATE_PRIVATE_MESSAGE, { uid: auth().currentUser.uid || null })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logCreatePublicForum = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }

            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.CREATE_PUBLIC_FORUM, { uid: auth().currentUser.uid || null })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logChatClick = (chat_id) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }

            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.CHAT_CLICK, { uid: auth().currentUser.uid, chat_id })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };

    logCreatePost = (type, post_id) => {
        return new Promise((resolve, reject) => {
            if (!type || !post_id) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return analytics()
                .logEvent(ANALYTICS_CONSTANTS.CREATE_POST, { uid: auth().currentUser?.uid || null, type, post_id })
                .then(resolve)
                .catch((error) => {
                    console.log('[Analytics Error]:', error);
                    resolve();
                });
        });
    };
}

export default new FirebaseAnalytics();
