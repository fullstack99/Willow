import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import User from '../../service/firebase_requests/User';
import { fonts, colors } from '../../constants';

const ChatRoomTitle = ({ room, users, onSubTitlePress }) => {
    const [title, setTitle] = useState('');
    const [subTitle, setSubTitle] = useState('');

    useEffect(() => {
        if (room.type === 'direct_message' && Array.isArray(users) && users.length === 1) {
            const userID = users[0];
            User.getUserById(userID)
                .then((user) => {
                    setTitle(user?.name);
                    setSubTitle(user?.username);
                })
                .catch(console.log);
        } else if (room.type === 'private_group' && Array.isArray(room?.members) && room?.members.length > 1) {
            if (room?.name) {
                setTitle(room.name);
            } else {
                Promise.all(room?.members.map((uid) => User.getUserById(uid))).then((data) => {
                    let name = '';
                    data.forEach((u, index) => {
                        if (index === data.length - 1) {
                            name = name.concat(u.name);
                        } else {
                            name = name.concat(`${u.name}, `);
                        }
                    });
                    setTitle(name);
                });
            }
            setSubTitle(`${room?.members?.length} ${room?.members?.length === 1 ? 'member' : 'members'}`);
        } else if (room.type === 'public_forum') {
            setTitle(room?.name);
            setSubTitle(`${room?.members?.length} ${room?.members?.length === 1 ? 'member' : 'members'}`);
        } else return;
    }, [room, users]);

    return (
        <View style={styles.container}>
            <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                {title}
            </Text>
            <TouchableOpacity disabled={!onSubTitlePress} onPress={onSubTitlePress}>
                <Text style={styles.subTitle}>{subTitle}</Text>
            </TouchableOpacity>
        </View>
    );
};

export default ChatRoomTitle;

const styles = StyleSheet.create({
    container: {
        justifyContent: 'space-evenly',
        alignItems: 'center',
        paddingRight: 20,
    },
    title: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
        paddingBottom: 2.5,
    },
    subTitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: '#9D9D9D',
    },
});
