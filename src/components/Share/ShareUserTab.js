import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { fonts, colors } from '../../constants';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import FirebaseChatMessage from '../../service/firebase_requests/ChatMessage';
import FirebaseError from '../../service/firebase_errors';

const ShareUserTab = ({ user, data, setError, toggleToastMessage }) => {
    const currentUser = useSelector((state) => state.auth.user);
    const [shareRef, setShareRef] = useState(null);
    const [loading, setLoading] = useState(false);

    const _shareToUser = () => {
        setLoading(true);
        if (shareRef) {
            shareRef.delete &&
                shareRef
                    .delete()
                    .then(() => {
                        setShareRef(null);
                    })
                    .catch((error) => FirebaseError.setError(error, setError))
                    .finally(() => setLoading(false));
        } else {
            switch (data.type) {
                case DATABASE_CONSTANTS.TIPS:
                case DATABASE_CONSTANTS.REVIEWS:
                case DATABASE_CONSTANTS.QUESTIONS:
                    return FirebaseChatMessage.sharePostWithFriend(user, data, currentUser)
                        .then(setShareRef)
                        .catch((error) => FirebaseError.setError(error, setError))
                        .finally(() => {
                            toggleToastMessage && toggleToastMessage();
                            setLoading(false);
                        });
                case 'share_item':
                    return FirebaseChatMessage.shareItemWithFriend(user, data, currentUser)
                        .then(setShareRef)
                        .catch((error) => FirebaseError.setError(error, setError))
                        .finally(() => {
                            toggleToastMessage && toggleToastMessage();
                            setLoading(false);
                        });
                default:
                    return;
            }
        }
    };

    return (
        <View style={styles.userContainer}>
            <FastImage source={{ uri: user.avatar_url }} resizeMode="contain" style={styles.userAvatar} />
            <View style={styles.nameContainer}>
                <Text style={styles.name} numberOfLines={1}>
                    {user.name}
                </Text>
                <Text style={styles.username} numberOfLines={1}>
                    {user.username}
                </Text>
            </View>

            <TouchableOpacity style={styles.icon} disabled={loading} onPress={_shareToUser}>
                <MaterialIcons name={shareRef ? 'cancel-schedule-send' : 'send'} size={24} color={colors.PRIMARY_COLOR} />
            </TouchableOpacity>
        </View>
    );
};

export default ShareUserTab;

const styles = StyleSheet.create({
    userContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 15,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    nameContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        marginHorizontal: 20,
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    username: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
    },
});
