import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import EThreeService from '../../../../service/virgil_security';
import FirebaseChat from '../../../../service/firebase_requests/Chat';
import FirebaseChatMessage from '../../../../service/firebase_requests/ChatMessage';
import MyMessage from '../../Message/MyMessage';
import OthersMessage from '../../Message/OthersMessage';

const GroupMessage = ({
    navigation,
    roomID,
    room,
    item,
    GroupsEThree,
    memberCard,
    openMessageActionDialog,
    openMessageLikesDialog,
    openImageDialog,
}) => {
    const user = useSelector((state) => state.auth.user);
    const [EThree, setEThree] = useState(GroupsEThree || null);
    const [decryptedMessage, setDecryptedMessage] = useState(null);
    const [decryptedImages, setDecryptedImages] = useState(null);
    const [decrypedAttachedMessage, setDecryptedAttachedMessage] = useState(null);

    useEffect(() => {
        EThreeService.getEthree()
            .findUsers(room.owner)
            .then((ownerCard) => {
                EThreeService.getEthree().loadGroup(roomID, ownerCard).then(setEThree).catch(console.log);
            });
    }, [roomID, room?.members]);

    useEffect(() => {
        if (!item.message || !item.user || !EThree || !Array.isArray(memberCard)) {
            setDecryptedMessage(null);
        } else {
            const messageSenderCard =
                memberCard.filter((member) => member.id === item.user.uid).length === 1
                    ? memberCard.filter((member) => member.id === item.user.uid)[0].userCard
                    : null;
            if (messageSenderCard) {
                EThree.decrypt(item.message, messageSenderCard).then((result) => {
                    setDecryptedMessage(result);
                });
            } else setDecryptedMessage('[system message]: user has left the chat');
        }
    }, [item, EThree, memberCard]);

    useEffect(() => {
        const onImages = (imagesQuerySnapshot) => {
            if (imagesQuerySnapshot.empty) {
                setDecryptedImages([]);
            } else {
                setDecryptedImages(
                    imagesQuerySnapshot.docs.map((image) => {
                        return { id: image.id, ...image.data() };
                    }),
                );
            }
        };
        const unsubscribe = FirebaseChatMessage.initChatImageListener(roomID, item.id, onImages, console.log);

        return unsubscribe;
    }, [item.id, roomID]);

    // useEffect(() => {
    //     let unsubscribe;
    //     const onImages = (imagesQuerySnapshot) => {
    //         if (imagesQuerySnapshot.empty) {
    //             setDecryptedImages([]);
    //         } else {
    //             Promise.all(
    //                 imagesQuerySnapshot.docs.map((documentSnapshot) => {
    //                     const image = { id: documentSnapshot.id, ...documentSnapshot.data() };
    //                     const messageSenderCard =
    //                         memberCard.filter((member) => member.id === image?.user).length === 1
    //                             ? memberCard.filter((member) => member.id === image?.user)[0].userCard
    //                             : null;
    //                     if (!messageSenderCard) return setDecryptedMessage('[system message]: user has left the chat');
    //                     return FirebaseChatMessage.decryptGroupImage(EThree, image, messageSenderCard);
    //                 }),
    //             )
    //                 .then(setDecryptedImages)
    //                 .catch((error) => {
    //                     console.log(error);
    //                     setDecryptedImages([]);
    //                 });
    //         }
    //     };
    //     if (EThree && memberCard) {
    //         unsubscribe = FirebaseChatMessage.initChatImageListener(roomID, item.id, onImages, console.log);
    //     }
    //     return () => unsubscribe && unsubscribe();
    // }, [item.id, EThree, roomID, memberCard]);

    useEffect(() => {
        let unsubscribe;
        const onReplyMessage = (messageSnapshot) => {
            if (messageSnapshot.data().message && messageSnapshot.data().user) {
                const messageSenderCard =
                    memberCard.filter((member) => member.id === messageSnapshot.data().user.uid).length === 1
                        ? memberCard.filter((member) => member.id === messageSnapshot.data().user.uid)[0].userCard
                        : null;
                if (messageSenderCard) {
                    EThree.decrypt(messageSnapshot.data().message, messageSenderCard).then((decryptedMessage) => {
                        setDecryptedAttachedMessage({
                            id: messageSnapshot.id,
                            ...messageSnapshot.data(),
                            message: decryptedMessage,
                        });
                    });
                } else {
                    setDecryptedAttachedMessage({
                        id: messageSnapshot.id,
                        ...messageSnapshot.data(),
                        message: '[system message]: user has left the chat',
                    });
                }
            }
        };
        if (memberCard && !item?.deleted && item?.replyToMessageID && EThree) {
            unsubscribe = FirebaseChat.getMessageByID(roomID, item.replyToMessageID, onReplyMessage, console.log);
        }

        return () => unsubscribe && unsubscribe();
    }, [roomID, item?.replyToMessageID, EThree, memberCard]);

    if (typeof decryptedMessage !== 'string' && !Array.isArray(decryptedImages)) return null;
    else if (item.user.uid === user.uid) {
        return (
            <View style={styles.container}>
                <View style={styles.placeholder} />
                <MyMessage
                    navigation={navigation}
                    roomID={roomID}
                    room={room}
                    message={{ ...item, message: decryptedMessage, images: decryptedImages }}
                    attachedMessage={decrypedAttachedMessage}
                    openMessageActionDialog={openMessageActionDialog}
                    openMessageLikesDialog={openMessageLikesDialog}
                    openImageDialog={openImageDialog}
                />
            </View>
        );
    } else {
        return (
            <View style={styles.container}>
                <OthersMessage
                    navigation={navigation}
                    roomID={roomID}
                    room={room}
                    message={{ ...item, message: decryptedMessage, images: decryptedImages }}
                    showAvatar
                    attachedMessage={decrypedAttachedMessage}
                    openMessageActionDialog={openMessageActionDialog}
                    openMessageLikesDialog={openMessageLikesDialog}
                    openImageDialog={openImageDialog}
                />
                <View style={styles.placeholder} />
            </View>
        );
    }
};

export default GroupMessage;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    placeholder: {
        flex: 1,
    },
});
