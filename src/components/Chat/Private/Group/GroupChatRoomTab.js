import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableHighlight } from 'react-native';
import moment from 'moment';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../../../constants';
import { CHATTING, PRIVATE_GROUP_CHATROOM } from '../../../../navigator/constants';
import { TIPS, REVIEWS, QUESTIONS } from '../../../../constants/Database';
import User from '../../../../service/firebase_requests/User';
import FirebaseAnalytics from '../../../../service/firebase_analytics';
import EThreeService from '../../../../service/virgil_security';
import PinSvg from '../../../../assets/Images/pin.svg';
import MuteSvg from '../../../../assets/Images/mute.svg';
import UnreadCounter from '../../UnreadCounter';
import PrivateGroupAvatar from './PrivateGroupAvatar';

const GroupChatRoomTab = ({ navigation, room }) => {
    if (!room) return null;
    const { user } = useSelector((state) => state.auth);
    const [GroupsEThree, setGroupsEThree] = useState(null);
    const [member, setMember] = useState(null);
    const [memberCard, setMemberCard] = useState(null);
    const [lastMessage, setLastMessage] = useState('');
    const pinned = room.pinned.indexOf(user?.uid) !== -1;
    const muted = room.muted.indexOf(user?.uid) !== -1;

    useEffect(() => {
        if (user?.uid && room.id && room.owner && Array.isArray(room.members)) {
            Promise.all(room.members.map((memberID) => User.getUserById(memberID)))
                .then((members) => {
                    setMember(members);
                })
                .catch(console.log);
            EThreeService.getGroupEThree(room.id, room.owner)
                .then(setGroupsEThree)
                .catch(() => {
                    setTimeout(() => {
                        EThreeService.getGroupEThree(room.id, room.owner).then(setGroupsEThree).catch(console.log);
                    }, 2000);
                });
            EThreeService.getGroupMembersCard(room.members).then(setMemberCard).catch(console.log);
        }
    }, [user?.uid, room.id, room.owner, room.members]);

    useEffect(() => {
        const roomsLastMessage = room?.latest_message;
        if (!user || !GroupsEThree || !roomsLastMessage) return;
        else if (roomsLastMessage?.deleted) {
            setLastMessage('message was deleted');
        } else if (room.latest_message?.type === 'poll') {
            return setLastMessage('🗳');
        } else if (roomsLastMessage?.type === 'share_post') {
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
        } else if (room.latest_message?.type === 'share_item') {
            return setLastMessage('shared an item');
        } else if (!roomsLastMessage?.message && Array.isArray(roomsLastMessage?.images) && roomsLastMessage?.images.length > 0) {
            setLastMessage('📸');
        } else if (GroupsEThree && roomsLastMessage?.message && roomsLastMessage?.user) {
            EThreeService.findUsers(roomsLastMessage?.user.uid)
                .then((messageSender) => {
                    GroupsEThree.decrypt(roomsLastMessage.message, messageSender)
                        .then((decryptedMessage) => {
                            setLastMessage(decryptedMessage);
                        })
                        .catch(console.log);
                })
                .catch(console.log);
        } else {
            setLastMessage('');
        }
    }, [user, GroupsEThree, room?.latest_message]);

    const _date = (seconds) => {
        const convertDate = moment(new Date(seconds * 1000)).fromNow();
        return <Text style={styles.timestamp}>{convertDate}</Text>;
    };

    const _lastMessageUsername = () => {
        // const lastMessageUserID = room?.latest_message?.user.uid;
        // if (!Array.isArray(member) || !lastMessageUserID) return null;
        // else if (lastMessageUserID === user?.uid) {
        //     return `${user.username}: `;
        // } else {
        //     const memberIndex = member.findIndex((member) => member.uid === lastMessageUserID);
        //     return memberIndex === -1 ? null : `${member[memberIndex].username}: `;
        // }
        return `${room?.latest_message?.user.username}: ` || null;
    };

    const _groupName = () => {
        if (room?.name) {
            return room.name;
        } else if (Array.isArray(member)) {
            let name = '';
            member.forEach((u, index) => {
                if (index === member.length - 1) {
                    name = name.concat(u.name);
                } else {
                    name = name.concat(`${u.name}, `);
                }
            });
            return name;
        } else {
            return '';
        }
    };

    const _navigateToChat = () => {
        room?.id && FirebaseAnalytics.logChatClick(room.id);
        navigation && navigation.push(CHATTING, { room, memberCard });
    };

    return (
        <TouchableHighlight disabled={!GroupsEThree || !memberCard} onPress={_navigateToChat} underlayColor={colors.WHITE}>
            <View style={styles.container}>
                {Array.isArray(member) ? (
                    <PrivateGroupAvatar room={room} members={member} />
                ) : (
                    <View style={{ height: 50, width: 80 }} />
                )}

                <View style={styles.userInfo}>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                        {_groupName()}
                    </Text>
                    {lastMessage ? (
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

export default GroupChatRoomTab;

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
