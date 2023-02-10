import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';
import { colors, fonts } from '../../constants';
import * as constants from '../../constants/Database';
import * as FirebaseErrorsConstants from '../../service/firebase_errors/constants';

const NOTIFICATION_REF = firestore().collection(constants.NOTIFICATION);
class Notification {
    getNotificationMessage = (notification, username, navigateToUser) => {
        switch (notification.type) {
            case constants.FRIEND_REQUEST:
                if (notification?.decline) {
                    return (
                        <Text style={styles.message}>
                            you declined{' '}
                            <Text style={styles.username} onPress={navigateToUser}>
                                {`${username}'s`}
                            </Text>{' '}
                            request to follow you
                        </Text>
                    );
                } else if (notification.pending) {
                    return (
                        <Text style={styles.message}>
                            <Text style={styles.username} onPress={navigateToUser}>
                                {username}
                            </Text>{' '}
                            has requested to follow you
                        </Text>
                    );
                } else {
                    return (
                        <Text style={styles.message}>
                            <Text style={styles.username} onPress={navigateToUser}>
                                {username}
                            </Text>{' '}
                            started following you
                        </Text>
                    );
                }
            case constants.COMMENTS_NOTIFICATION:
                return (
                    <Text style={styles.message}>
                        <Text style={styles.username} onPress={navigateToUser}>
                            {notification.anonymous ? '@anonymous' : username}
                        </Text>{' '}
                        has commented on your{' '}
                        {notification.feed.type === constants.TIPS
                            ? 'tip'
                            : notification.feed.type === constants.QUESTIONS
                            ? 'question'
                            : notification.feed.type === constants.REVIEWS
                            ? 'review'
                            : ''}
                    </Text>
                );
            case constants.REPLIES_NOTIFICATION:
                return (
                    <Text style={styles.message}>
                        <Text style={styles.username} onPress={navigateToUser}>
                            {notification.anonymous ? '@anonymous' : username}
                        </Text>{' '}
                        has replied on your comment
                    </Text>
                );
            default:
                return <Text style={styles.message}>don't know what to say yet</Text>;
        }
    };

    readNotification = (notification) => {
        return new Promise((resolve, reject) => {
            if (!notification.id || !notification.ref) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            firestore()
                .doc(notification.ref)
                .get()
                .then((documentSnapshot) => {
                    if (documentSnapshot.exists) {
                        documentSnapshot.ref
                            .update({
                                read: true,
                                read_at: firestore.FieldValue.serverTimestamp(),
                            })
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    } else {
                        resolve();
                    }
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    clearNotifications = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            NOTIFICATION_REF.doc(auth().currentUser.uid)
                .delete()
                .then(resolve)
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };
}

export default new Notification();

const styles = StyleSheet.create({
    username: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    message: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
});
