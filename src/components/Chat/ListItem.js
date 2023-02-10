import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';
import moment from 'moment';

import EThreeService from '../../service/ethree_service';
import UserService from '../../service/firebase_requests/User';
import { colors, fonts } from '../../constants';
import CheckBoxSvg from '../../assets/Images/check_box.svg';
import AddFriendSvg from '../../assets/Images/add_friend.svg';
import AddedFriendSvg from '../../assets/Images/added_friend.svg';
import PinSvg from '../../assets/Images/pin.svg';
import MuteSvg from '../../assets/Images/mute.svg';
import LockSvg from '../../assets/Images/bag-green.svg';
import AvatarIcon from '../../assets/Images/avatar.png';

const ListItem = ({ item, selectedUsers = [], onPress, from }) => {
    const { user } = useSelector((state) => state.auth);
    const [descryptedMessage, setDecryptedMessage] = useState('');
    const [users, setUsers] = useState([]);

    useEffect(() => {
        item.roomType !== 'new_public_forum' && item.user?.id && decrypteMessage(item);
        const handleUserSnapshot = (snapshot) => {
            const index = users.findIndex((v) => v.uid === snapshot.id);
            if (index < 0) {
                users.push({ uid: snapshot.id, ...snapshot.data() });
                setUsers(users);
            }
        };
        if (item.roomType === 'new_direct') {
            const members = item.members.filter((v) => v.userId !== user.uid);
            members.forEach((member) => {
                if (member.userId) {
                    UserService.retrieveUserById(member.userId, handleUserSnapshot, (message) => {
                        console.log('error', message);
                    });
                }
            });
        }
    }, [item]);

    const decrypteMessage = async (item) => {
        try {
            const message = item.lastMessage ? item.lastMessage : item.lastAliasMessage;
            const senderCard = await EThreeService.getEThreeInstance().findUsers(item.user.id);
            const _decryptedMessage = await EThreeService.getEThreeInstance().authDecrypt(message, senderCard);
            if (item.user.id === user.uid) {
                setDecryptedMessage(`You: ${_decryptedMessage}`);
            } else {
                const sender = users.find((v) => v.uid === item.user.id);
                setDecryptedMessage(`${sender?.username}: ${_decryptedMessage}`);
            }
        } catch (err) {
            console.log('descrypted error in the list', err);
        }
    };

    const lastMessage = (item) => {
        return item.lastMessage ? item.lastMessage : item.lastAliasMessage;
    };

    const _date = (seconds) => {
        const convertDate = moment(new Date(seconds * 1000)).fromNow();
        return <Text style={styles.username}>{convertDate}</Text>;
    };

    const _renderAvatar = () => {
        if (users.length > 1) {
            return <FastImage style={styles.avatar} source={item.avatar_url ? { uri: item.avatar_url } : AvatarIcon} />;
        } else {
            return <FastImage style={styles.avatar} source={{ uri: users[0]?.avatar_url }} />;
        }
    };

    const _renderName = () => {
        let usernames = '';
        users.forEach((member, index) => {
            if (index !== users.length - 1) {
                usernames += member.name + ', ';
            } else {
                usernames += member.name;
            }
        });
        return usernames;
    };

    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress && onPress(item)}>
            <View style={styles.user}>
                {item.roomType === 'new_direct' ? (
                    _renderAvatar()
                ) : (
                    <FastImage style={styles.avatar} source={item.avatar_url ? { uri: item.avatar_url } : AvatarIcon} />
                )}

                {from === 'public' && item.adminApprove && (
                    <View style={styles.lock}>
                        <LockSvg />
                    </View>
                )}
                <View style={styles.userInfo}>
                    {item.roomType === 'new_direct' ? (
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                            {_renderName()}
                        </Text>
                    ) : (
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                            {item.name || item.roomName}
                        </Text>
                    )}

                    {from === 'chatsList' ? (
                        <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                            {item.roomType === 'new_public_forum' ? lastMessage(item) : descryptedMessage}
                        </Text>
                    ) : (
                        from !== 'contacts' && <Text style={styles.username}>{item.username}</Text>
                    )}
                </View>
            </View>
            {from === 'chatsList' && (
                <View style={styles.message}>
                    {_date(item.updated_at?._seconds)}
                    <View style={styles.chatStatus}>
                        {item.pinned && <PinSvg />}
                        {!!item.mute && <MuteSvg style={styles.mute} />}
                        {item.unRead ? (
                            <View style={styles.unReadWrapper}>
                                <Text style={styles.unRead}>{item.unRead}</Text>
                            </View>
                        ) : null}
                    </View>
                </View>
            )}
            {(from === 'contacts' || from === 'new_direct') && selectedUsers.findIndex((v) => v.uid === item.uid) > -1 && (
                <CheckBoxSvg />
            )}
            {from === 'friend' &&
                (selectedUsers.findIndex((v) => v.uid === item.uid) > -1 ? <AddedFriendSvg /> : <AddFriendSvg />)}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    listContainer: {
        paddingHorizontal: 20,
        backgroundColor: colors.WHITE,
        zIndex: 99,
        height: 50,
    },
    listHeader: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.BLACK,
        opacity: 0.4,
        marginBottom: 5,
        marginTop: 10,
    },
    message: {
        height: 50,
        alignItems: 'flex-end',
        justifyContent: 'space-between',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    },
    count: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.WHITE,
    },
    userInfo: {
        width: '60%',
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
    username: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.GREY_2,
        marginTop: 3,
    },
    unReadWrapper: {
        backgroundColor: colors.PRIMARY_COLOR,
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 10,
    },
    unRead: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.WHITE,
    },
    chatStatus: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
    },
    mute: {
        marginTop: 7,
    },
    owner: {
        color: colors.GREY_2,
        fontSize: 13,
        fontFamily: fonts.MULISH_REGULAR,
        marginRight: 40,
    },
    lock: {
        position: 'absolute',
        left: 40,
        bottom: 0,
    },
});
export default ListItem;
