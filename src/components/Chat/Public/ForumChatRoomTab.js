import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../../../constants';
import { TIPS, REVIEWS, QUESTIONS } from '../../../constants/Database';
import { CHATTING } from '../../../navigator/constants';
import FirebaseAnalytics from '../../../service/firebase_analytics';
import UnreadCounter from '../UnreadCounter';
import PinSvg from '../../../assets/Images/pin.svg';
import MuteSvg from '../../../assets/Images/mute.svg';

const ForumChatRoomTab = ({ navigation, room }) => {
    const user = useSelector((state) => state.auth.user);
    const [lastMessage, setLastMessage] = useState('');
    const pinned = room.pinned.indexOf(user?.uid) !== -1;
    const muted = room.muted.indexOf(user?.uid) !== -1;

    useEffect(() => {
        if (!room?.latest_message) return;
        else if (room.latest_message?.deleted) return setLastMessage('message was deleted');
        else if (room.latest_message?.type === 'share_post') {
            switch (room.latest_message?.postType) {
                case TIPS:
                    return setLastMessage('shared a tip');
                case REVIEWS:
                    return setLastMessage('shared a reivew');
                case QUESTIONS:
                    return setLastMessage('shared a question');
                default:
                    return setLastMessage('shared a post');
            }
        } else if (room.latest_message?.type === 'poll') {
            return setLastMessage('🗳');
        } else if (room.latest_message?.type === 'share_item') {
            return setLastMessage('shared an item');
        } else if (room.latest_message?.message) return setLastMessage(room.latest_message.message);
        else if (
            !room.latest_message?.message &&
            Array.isArray(room?.latest_message?.images) &&
            room?.latest_message?.images.length > 0
        )
            return setLastMessage('📸');
        else return setLastMessage('');
    }, [room?.latest_message]);

    const _date = (seconds) => {
        const convertDate = moment(new Date(seconds * 1000)).fromNow();
        return <Text style={styles.timestamp}>{convertDate}</Text>;
    };

    const _lastMessageUsername = () => {
        // if (room?.latest_message?.user.uid === user?.uid) {
        //     return `${user.username}: `;
        // } else if (Array.isArray(members)) {
        //     const memberIndex = members.findIndex((member) => member.uid === room?.latest_message?.user.uid);
        //     if (memberIndex === -1) return null;
        //     else return `${members[memberIndex]?.username}: `;
        // } else return null;
        return `${room?.latest_message?.user.username}: ` || null;
    };

    const _navigateToChat = () => {
        room?.id && FirebaseAnalytics.logChatClick(room.id);
        navigation && navigation.push(CHATTING, { room });
    };

    return (
        <TouchableHighlight onPress={_navigateToChat} underlayColor={colors.WHITE}>
            <View style={styles.container}>
                <FastImage style={styles.avatar} source={{ uri: room?.avatar_url }} resizeMode={FastImage.resizeMode.contain} />

                <View style={styles.userInfo}>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                        {room?.name}
                    </Text>
                    {room?.latest_message ? (
                        <Text style={styles.message} numberOfLines={1} ellipsizeMode="tail">
                            {_lastMessageUsername()}
                            {lastMessage}
                        </Text>
                    ) : (
                        <Text style={[styles.message, { fontStyle: 'italic' }]} numberOfLines={1} ellipsizeMode="tail">
                            no messages yet
                        </Text>
                    )}
                </View>

                <View style={styles.chatRoomInfo}>
                    {_date(room.updated_at?._seconds)}
                    <View style={styles.chatStatus}>
                        {pinned && <PinSvg />}
                        {muted && <MuteSvg style={styles.mute} />}
                        <UnreadCounter room={room} />
                    </View>
                </View>
            </View>
        </TouchableHighlight>
    );
};

export default ForumChatRoomTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        height: 65,
    },
    chatRoomInfo: {
        height: 50,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginHorizontal: 15,
    },
    userInfo: {
        flex: 1,
        height: 50,
        justifyContent: 'space-evenly',
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
    message: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: '#9D9D9D',
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.GREY_2,
        marginTop: 3,
    },
    chatStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    mute: {
        marginLeft: 5,
    },
    owner: {
        color: colors.GREY_2,
        fontSize: 13,
        fontFamily: fonts.MULISH_REGULAR,
        marginRight: 40,
    },
});
