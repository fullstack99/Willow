import React, { useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../constants';
import FirebaseChat from '../../service/firebase_requests/Chat';
import ChatDeleteSvg from '../../assets/Images/Chat/chat-delete.svg';
import ChatHideSvg from '../../assets/Images/Chat/chat-hide.svg';
import ChatPinSvg from '../../assets/Images/Chat/chat-pin.svg';
import ChatRingSvg from '../../assets/Images/Chat/chat-ring.svg';
import AddUserSvg from '../../assets/Images/add_user.svg';

const ChatRoomHiddenItem = ({ room, rowMap, setSelectedRoom, deleteRef }) => {
    const user = useSelector((state) => state.auth.user);
    const pinned = (user?.uid && room?.pinned.indexOf(user.uid) !== -1) || false;
    const muted = (user?.uid && room?.muted.indexOf(user.uid) !== -1) || false;
    const [loading, setLoading] = useState(false);
    const showDeleteModal = (rowMap, room) => {
        setSelectedRoom(room);
        closeRow(rowMap, room.id);
        deleteRef.current && deleteRef.current.open();
    };

    const closeRow = (rowMap, rowKey) => {
        if (rowMap[rowKey]) {
            rowMap[rowKey].closeRow();
        }
    };

    const togglePin = (rowMap, room) => {
        closeRow(rowMap, room.id);
        setLoading(true);
        if (pinned) {
            FirebaseChat.pinChatRoom(room.id, false)
                .catch(console.log)
                .finally(() => setLoading(false));
        } else {
            FirebaseChat.pinChatRoom(room.id, true)
                .catch(console.log)
                .finally(() => setLoading(false));
        }
    };

    const toggleMute = (rowMap, room) => {
        closeRow(rowMap, room.id);
        setLoading(true);
        if (muted) {
            FirebaseChat.muteChatRoom(room.id, false)
                .catch(console.log)
                .finally(() => setLoading(false));
        } else {
            FirebaseChat.muteChatRoom(room.id, true)
                .catch(console.log)
                .finally(() => setLoading(false));
        }
    };

    return (
        <View style={styles.rowBack}>
            <TouchableOpacity style={styles.icon} disabled={loading} onPress={() => togglePin(rowMap, room)}>
                <ChatPinSvg style={{ color: pinned ? colors.RED_2 : colors.PRIMARY_COLOR }} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.icon} disabled={loading} onPress={() => toggleMute(rowMap, room)} style={styles.icon}>
                <ChatRingSvg style={{ color: muted ? colors.RED_2 : colors.PRIMARY_COLOR }} />
            </TouchableOpacity>
            <TouchableOpacity
                style={[
                    {
                        height: 60,
                        width: 60,
                        borderRadius: 25,
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: colors.RED_2,
                        marginRight: 10,
                    },
                ]}
                disabled={loading}
                onPress={() => showDeleteModal(rowMap, room)}>
                <ChatHideSvg color={colors.WHITE} />
            </TouchableOpacity>
        </View>
    );
};

export default ChatRoomHiddenItem;

const styles = StyleSheet.create({
    rowBack: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        height: 60,
    },
    icon: {
        paddingRight: 10,
    },
});
