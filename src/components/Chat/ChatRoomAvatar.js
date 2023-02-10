import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../../constants';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import User from '../../service/firebase_requests/User';
import PrivateGroupAvatar from '../../components/Chat/Private/Group/PrivateGroupAvatar';

const ChatRoomAvatar = ({ navigation, room, users }) => {
    const [user, setUser] = useState(null);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        if (room?.type === 'direct_message' && Array.isArray(users) && users.length === 1) {
            const userID = users[0];
            User.getUserById(userID)
                .then((user) => {
                    setUser(user);
                    setAvatar(user?.avatar_url);
                })
                .catch(console.log);
        } else if (room?.type === 'private_group' && Array.isArray(users) && users.length > 1) {
            return;
        } else if (room?.type === 'public_forum' && room?.avatar_url) {
            setAvatar(room.avatar_url);
        } else return;
    }, [room, users]);

    const avatarNavigate = () => {
        if (room?.type === 'direct_message' && Array.isArray(users) && users.length === 1) {
            const userID = users[0];
            return navigation && user && navigation.push(NAVIGATOR_CONSTANTS.DIRECT_MESSAGE_SETTING, { room, user });
        } else if (room?.type === 'private_group') {
            return navigation && navigation.push(NAVIGATOR_CONSTANTS.PRIVATE_GROUP_SETTING, { room });
        } else if (room?.type === 'public_forum') {
            return navigation && navigation.push(NAVIGATOR_CONSTANTS.CHAT_SETTING, { room });
        } else return;
    };

    if (room?.type === 'private_group') {
        return (
            <TouchableOpacity style={{ marginRight: 10 }} onPress={avatarNavigate}>
                <PrivateGroupAvatar room={room} memberIDs={room?.members} onPress={avatarNavigate} />
            </TouchableOpacity>
        );
    } else if (avatar) {
        return (
            <TouchableOpacity style={styles.container} onPress={avatarNavigate}>
                <FastImage source={{ uri: avatar }} style={styles.avatar} resizeMode={FastImage.resizeMode.contain} />
            </TouchableOpacity>
        );
    } else return null;
};

export default ChatRoomAvatar;

const styles = StyleSheet.create({
    container: {
        marginRight: 30,
    },
    avatar: {
        height: 45,
        width: 45,
        borderRadius: 45 / 2,
    },
});
