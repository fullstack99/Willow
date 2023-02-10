import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../constants';
import FirebaseChat from '../../service/firebase_requests/Chat';

const UnreadCounter = ({ room }) => {
    const user = useSelector((state) => state.auth.user);
    const [unread, setUnread] = useState(0);
    useEffect(() => {
        let unsubscribe;
        const onUnread = (querySnapshot) => {
            setUnread(querySnapshot.size);
        };

        if (user && room?.id) {
            unsubscribe = FirebaseChat.getChatRoomUnread(room.id, onUnread, console.log);
        }

        return () => unsubscribe && unsubscribe();
    }, [room, user]);

    if (unread === 0) return null;

    return (
        <View style={styles.container}>
            <Text style={styles.unread}>{unread}</Text>
        </View>
    );
};

export default UnreadCounter;

const styles = StyleSheet.create({
    container: {
        marginLeft: 10,
        paddingHorizontal: 12.5,
        paddingVertical: 3,
        borderRadius: 25,
        backgroundColor: colors.PRIMARY_COLOR,
    },
    unread: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 12,
        color: colors.WHITE,
    },
});
