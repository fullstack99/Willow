import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import FirebaseChat from '../../../service/firebase_requests/Chat';
import FirebaseChatMessage from '../../../service/firebase_requests/ChatMessage';
import MyMessage from '../Message/MyMessage';
import OthersMessage from '../Message/OthersMessage';

const ForumMessage = ({ navigation, roomID, room, item, openMessageActionDialog, openImageDialog, openMessageLikesDialog }) => {
    const user = useSelector((state) => state.auth.user);
    const [images, setImages] = useState([]);
    const [attachedMessage, setAttachedMessage] = useState(null);
    const isMember = (Array.isArray(room?.members) && room.members.indexOf(user?.uid) !== -1) || false;

    useEffect(() => {
        const onImages = (imagesQuerySnapshot) => {
            if (imagesQuerySnapshot.empty) {
                setImages([]);
            } else {
                setImages(
                    imagesQuerySnapshot.docs.map((image) => {
                        return { id: image.id, ...image.data() };
                    }),
                );
            }
        };
        const unsubscribe = FirebaseChatMessage.initChatImageListener(roomID, item.id, onImages, console.log);

        return unsubscribe;
    }, [item.id, roomID]);

    useEffect(() => {
        let unsubscribe;
        const onReplyMessage = (attachedMessageSnapshot) => {
            setAttachedMessage({ id: attachedMessageSnapshot.id, ...attachedMessageSnapshot.data() });
        };
        if (item?.replyToMessageID) {
            unsubscribe = FirebaseChat.getMessageByID(roomID, item.replyToMessageID, onReplyMessage, console.log);
        }

        return () => unsubscribe && unsubscribe();
    }, [roomID, item?.replyToMessageID]);

    if (item.user.uid === user.uid) {
        return (
            <View style={styles.container}>
                <View style={styles.placeholder} />
                <MyMessage
                    navigation={navigation}
                    roomID={roomID}
                    room={room}
                    message={{ ...item, images }}
                    attachedMessage={attachedMessage}
                    openMessageActionDialog={openMessageActionDialog}
                    openMessageLikesDialog={openMessageLikesDialog}
                    openImageDialog={isMember ? openImageDialog : () => {}}
                />
            </View>
        );
    } else {
        return (
            <View style={[styles.container, { maxWidth: '85%' }]}>
                <OthersMessage
                    navigation={navigation}
                    roomID={roomID}
                    room={room}
                    message={{ ...item, images }}
                    showAvatar
                    attachedMessage={attachedMessage}
                    openMessageActionDialog={openMessageActionDialog}
                    openMessageLikesDialog={openMessageLikesDialog}
                    openImageDialog={isMember ? openImageDialog : () => {}}
                />
            </View>
        );
    }
};

export default ForumMessage;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholder: {
        flex: 1,
    },
});
