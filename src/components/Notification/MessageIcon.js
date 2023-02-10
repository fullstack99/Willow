import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as USER_CONSTANTS from '../../constants/User';
import { colors, fonts } from '../../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import AddFriendIcon from '../../assets/Images/add_friend.svg';
import FriendIcon from '../../assets/Images/mutual_friend_button.svg';
import AlreadyFollowedIcon from '../../assets/Images/already_followed_button.svg';
import User from '../../service/firebase_requests/User';
import FirebaseNotification from '../../service/firebase_requests/Notification';
import FirebaseErrors from '../../service/firebase_errors';

const MessageIcon = ({ notification, user, setError }) => {
    const [status, setStatus] = useState(null);

    notification.type === DATABASE_CONSTANTS.FRIEND_REQUEST &&
        useEffect(() => {
            User.retrieveFollowingStatus(notification.uid, (querySnapshot) => {
                if (querySnapshot.size === 1) {
                    setStatus({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
                } else {
                    setStatus(null);
                }
            });
        }, [notification]);

    const _renderStatusIcon = () => {
        if (!status) return <AddFriendIcon />;
        else if (status.pending) return <AlreadyFollowedIcon />;
        else if (status.mutualFriend) return <FriendIcon />;
        else return <AlreadyFollowedIcon />;
    };

    const followerUser = () => {
        if (!user) return;
        if (user[USER_CONSTANTS.PRIVACY_PREFERENCE] === 'private') {
            Promise.all([
                User.requestToFollowUserById(user.uid),
                FirebaseNotification.readNotification(notification),
            ]).catch((error) => FirebaseErrors.setError(error, setError));
        } else {
            Promise.all([User.followUserById(user.uid), FirebaseNotification.readNotification(notification)]).catch((error) =>
                FirebaseErrors.setError(error, setError),
            );
        }
    };

    const acceptFriendRequest = () => {
        Promise.all([
            User.acceptFriendRequest(notification),
            FirebaseNotification.readNotification(notification),
        ]).catch((error) => FirebaseErrors.setError(error, setError));
    };

    const declineFriendRequest = () => {
        Promise.all([
            User.declineFriendRequest(notification),
            FirebaseNotification.readNotification(notification),
        ]).catch((error) => FirebaseErrors.setError(error, setError));
    };

    switch (notification.type) {
        case DATABASE_CONSTANTS.FRIEND_REQUEST:
            if (notification?.decline) {
                return null;
            } else if (notification.pending) {
                return (
                    <View>
                        <TouchableOpacity style={styles.checkmark} onPress={acceptFriendRequest}>
                            <FontAwesome name="check" size={20} color="white" />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.remove} onPress={declineFriendRequest}>
                            <FontAwesome name="remove" size={20} color="white" />
                        </TouchableOpacity>
                    </View>
                );
            } else {
                return (
                    <TouchableOpacity onPress={followerUser} disabled={status}>
                        {_renderStatusIcon()}
                    </TouchableOpacity>
                );
            }
        case DATABASE_CONSTANTS.COMMENTS_NOTIFICATION:
        case DATABASE_CONSTANTS.REPLIES_NOTIFICATION:
            if (notification.feed.image_url) {
                return (
                    <FastImage
                        source={{
                            uri:
                                typeof notification.feed.image_url === 'string'
                                    ? notification.feed.image_url
                                    : Array.isArray(notification.feed.image_url) && notification.feed.image_url.length > 0
                                    ? notification.feed.image_url[0]
                                    : notification.feed.product?.image,
                        }}
                        style={styles.postIcon}
                        resizeMode={FastImage.resizeMode.contain}
                    />
                );
            } else return null;
        default:
            return null;
    }
};

export default MessageIcon;

const styles = StyleSheet.create({
    checkmark: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: '#00B200',
        marginVertical: 5,
        borderRadius: 5,
    },
    remove: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        alignItems: 'center',
        backgroundColor: colors.RED,
        marginVertical: 5,
        borderRadius: 5,
    },
    postIcon: {
        width: 50,
        height: 50,
        borderRadius: 5,
    },
});
