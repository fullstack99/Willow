import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import moment from 'moment';
import User from '../../service/firebase_requests/User';
import FirebaseNotification from '../../service/firebase_requests/Notification';
import { colors, fonts } from '../../constants';
import * as USER_CONSTANTS from '../../constants/User';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import MessageIcon from './MessageIcon';
import Anonymous from '../../assets/Images/anonymous.svg';

const NotificationTab = ({ navigation, notification, setError }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        User.getUserById(notification.uid).then(setUser).catch(console.log);
    }, [notification]);

    const notificationOnPress = () => {
        switch (notification.type) {
            case DATABASE_CONSTANTS.FRIEND_REQUEST:
                return navigateToUser();
            case DATABASE_CONSTANTS.COMMENTS_NOTIFICATION:
            case DATABASE_CONSTANTS.REPLIES_NOTIFICATION:
                return navigateToPost();
            default:
                return;
        }
    };

    const navigateToUser = () => {
        navigation &&
            user?.uid &&
            !notification.anonymous &&
            navigation.push(NAVIGATOR_CONSTANTS.USER_PROFILE, { userID: user.uid });
        FirebaseNotification.readNotification(notification).catch(console.log);
    };

    const navigateToPost = () => {
        FirebaseNotification.readNotification(notification).catch(console.log);
        if (navigation && notification?.feed.id && notification?.feed.type) {
            switch (notification.feed.type) {
                case DATABASE_CONSTANTS.TIPS:
                    return navigation.push(NAVIGATOR_CONSTANTS.TIPS, { tipID: notification.feed.id });
                case DATABASE_CONSTANTS.QUESTIONS:
                    return navigation.push(NAVIGATOR_CONSTANTS.QUESTIONS, { questionID: notification.feed.id });
                case DATABASE_CONSTANTS.REVIEWS:
                    return navigation.push(NAVIGATOR_CONSTANTS.REVIEWS, { reviewID: notification.feed.id });
                default:
                    return;
            }
        }
    };

    if (!user) return null;
    return (
        <TouchableOpacity onPress={notificationOnPress}>
            <View style={notification.read ? styles.readNotification : styles.unreadNotification}>
                {notification?.anonymous ? (
                    <Anonymous style={styles.anonymous} />
                ) : (
                    <FastImage
                        source={{ uri: user.avatar_url }}
                        style={styles.avatar}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                )}
                <View style={styles.messageContainer}>
                    <View>
                        {FirebaseNotification.getNotificationMessage(notification, user[USER_CONSTANTS.USERNAME], navigateToUser)}
                    </View>
                    <Text style={styles.timestamp}>{moment(notification.created_at.toDate()).fromNow()}</Text>
                </View>

                <MessageIcon notification={notification} user={user} setError={setError} />
            </View>
        </TouchableOpacity>
    );
};

export default NotificationTab;

const styles = StyleSheet.create({
    unreadNotification: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.LIGHT_PRIMARY_COLOR,
        padding: 20,
    },
    readNotification: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        padding: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    anonymous: {
        transform: [{ rotate: '180deg' }],
        marginRight: 10,
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: '#a2a2a2',
        paddingTop: 10,
    },
    messageContainer: {
        paddingLeft: 10,
        flex: 1,
    },
});
