import React from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSelector } from 'react-redux';
import { USER_PROFILE, MY_PROFILE, PROFILE } from '../../../navigator/constants';
import MessageAvatarSkeleton from '../Skeleton/MessageAvatarSkeleton';

const MessageAvatar = ({ navigation, messageUser }) => {
    const user = useSelector((state) => state.auth.user);
    if (!messageUser?.uid || !messageUser?.avatar_url) return <MessageAvatarSkeleton />;

    const _navigateToUser = () => {
        if (user.uid === messageUser.uid) {
            return navigation && navigation.navigate(PROFILE, { screen: MY_PROFILE, initial: false });
        } else {
            return navigation && navigation.push(USER_PROFILE, { userID: messageUser.uid });
        }
    };

    return (
        <TouchableOpacity onPress={_navigateToUser} style={styles.container}>
            <FastImage
                source={{ uri: messageUser?.avatar_url }}
                style={styles.avatar}
                resizeMode={FastImage.resizeMode.contain}
            />
        </TouchableOpacity>
    );
};

export default MessageAvatar;

const styles = StyleSheet.create({
    container: {
        marginRight: 15,
    },
    avatar: {
        width: 35,
        height: 35,
        borderRadius: 35 / 2,
    },
});
