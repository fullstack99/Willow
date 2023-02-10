import localNotificationService from './localNotificationService';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import EThreeService from '../service/virgil_security';
import FirebaseChat from '../service/firebase_requests/Chat';
import FirebaseFeed from '../service/firebase_requests/Feed';
import * as USER_CONSTANTS from '../constants/User';
import * as DATABASE_CONSTANTS from '../constants/Database';
import * as NAVIGATOR_CONSTANTS from '../navigator/constants';

export const onRegister = (token) => {
    console.log('[App] onRegister: ', token);
    auth().currentUser &&
        firestore()
            .collection(DATABASE_CONSTANTS.USER)
            .doc(auth().currentUser.uid)
            .update({
                [USER_CONSTANTS.FCMTOKENS]: firestore.FieldValue.arrayUnion(token),
            });
};

export const onNotification = (notify) => {
    const options = {
        soundName: 'default',
        playSound: true,
    };
    // localNotificationService.showNotification(0, notify.title, notify.body, notify, options);
};

export const onOpenNotification = async (notify, navigateTo) => {
    try {
        console.log('[App] onOpenNotification: ', notify);
        if (notify.data?.roomID) {
            if (!auth().currentUser) return navigateTo(NAVIGATOR_CONSTANTS.PROFILE, { screen: NAVIGATOR_CONSTANTS.START_UP });
            const roomID = notify.data.roomID;
            setTimeout(
                () =>
                    navigateTo(NAVIGATOR_CONSTANTS.CHAT, {
                        screen: NAVIGATOR_CONSTANTS.CHATTING,
                        initial: false,
                        params: { roomID, available: true },
                    }),
                500,
            );
        }
        if (notify.data?.type) {
            console.log(notify.data);
            if (!auth().currentUser) return navigateTo(NAVIGATOR_CONSTANTS.PROFILE, { screen: NAVIGATOR_CONSTANTS.START_UP });
            else {
                switch (notify.data.type) {
                    case DATABASE_CONSTANTS.SHORT_SURVEY_NOTIFICATION:
                        return navigateTo(NAVIGATOR_CONSTANTS.FEED, {
                            screen: NAVIGATOR_CONSTANTS.WEBVIEW,
                            initial: false,
                            params: { available: true, uri: 'http://www.willow.app/feedback', title: 'feedback' },
                        });
                    case DATABASE_CONSTANTS.FOLLOWING_NOTIFICATION:
                        return (
                            notify.data?.userID &&
                            setTimeout(
                                () =>
                                    navigateTo(NAVIGATOR_CONSTANTS.FEED, {
                                        screen: NAVIGATOR_CONSTANTS.USER_PROFILE,
                                        initial: false,
                                        params: { available: true, userID: notify.data.userID },
                                    }),
                                100,
                            )
                        );
                    case DATABASE_CONSTANTS.FRIEND_REQUEST:
                        return navigateTo(NAVIGATOR_CONSTANTS.FEED, {
                            screen: NAVIGATOR_CONSTANTS.NOTIFICATIONS,
                            initial: false,
                            params: { available: true },
                        });
                    case DATABASE_CONSTANTS.POST_NOTIFICATION:
                    case DATABASE_CONSTANTS.COMMENTS_NOTIFICATION:
                    case DATABASE_CONSTANTS.REPLIES_NOTIFICATION:
                        switch (notify.data?.feedType) {
                            case DATABASE_CONSTANTS.TIPS:
                                if (!notify.data?.feedID) break;
                                else {
                                    return FirebaseFeed.getFeedByID(notify.data.feedID).then((feed) =>
                                        navigateTo(NAVIGATOR_CONSTANTS.FEED, {
                                            screen: NAVIGATOR_CONSTANTS.TIPS,
                                            initial: false,
                                            params: {
                                                available: feed ? true : false,
                                                tipID: notify.data.feedID,
                                                commentID: notify.data?.commentID,
                                                toggleComment: notify.data?.commentID ? true : false,
                                            },
                                        }),
                                    );
                                }

                            case DATABASE_CONSTANTS.QUESTIONS:
                                if (!notify.data?.feedID) break;
                                else {
                                    return FirebaseFeed.getFeedByID(notify.data.feedID).then((feed) =>
                                        navigateTo(NAVIGATOR_CONSTANTS.FEED, {
                                            screen: NAVIGATOR_CONSTANTS.QUESTIONS,
                                            initial: false,
                                            params: {
                                                available: feed ? true : false,
                                                questionID: notify.data.feedID,
                                                commentID: notify.data?.commentID,
                                            },
                                        }),
                                    );
                                }
                            case DATABASE_CONSTANTS.REVIEWS:
                                if (!notify.data?.feedID) break;
                                else {
                                    return FirebaseFeed.getFeedByID(notify.data.feedID).then((feed) =>
                                        navigateTo(NAVIGATOR_CONSTANTS.FEED, {
                                            screen: NAVIGATOR_CONSTANTS.REVIEWS,
                                            initial: false,
                                            params: {
                                                available: feed ? true : false,
                                                reviewID: notify.data.feedID,
                                                commentID: notify.data?.commentID,
                                                toggleComment: notify.data?.commentID ? true : false,
                                            },
                                        }),
                                    );
                                }
                            default:
                                return;
                        }
                    default:
                        return;
                }
            }
        }
    } catch (error) {
        console.warn(error);
    }
};
