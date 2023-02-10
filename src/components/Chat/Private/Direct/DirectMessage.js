import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { useSelector } from 'react-redux';
import EThreeService from '../../../../service/virgil_security';
import FirebaseChat from '../../../../service/firebase_requests/Chat';
import FirebaseChatMessage from '../../../../service/firebase_requests/ChatMessage';
import MyMessage from '../../Message/MyMessage';
import OthersMessage from '../../Message/OthersMessage';

const DirectMessage = ({ navigation, roomID, room, item, memberCard, openMessageActionDialog, openImageDialog }) => {
    const user = useSelector((state) => state.auth.user);
    const [EThree, setEThree] = useState(EThreeService.getEthree() || null);
    const [decryptedMessage, setDecryptedMessage] = useState(null);
    const [decryptedImages, setDecryptedImages] = useState(null);
    const [decrypedAttachedMessage, setDecryptedAttachedMessage] = useState(null);

    useEffect(() => {
        if (!EThree) EThreeService.initialize().then(setEThree).catch(console.log);
    }, [EThree]);

    useEffect(() => {
        if (!item.message) {
            setDecryptedMessage(null);
        } else if (item.user.uid === user.uid) {
            EThree.authDecrypt(item.message)
                .then((result) => {
                    setDecryptedMessage(result);
                })
                .catch((error) => {
                    setDecryptedMessage('');
                });
        } else if (memberCard) {
            EThree.authDecrypt(item.message, memberCard)
                .then((result) => setDecryptedMessage(result))
                .catch((error) => {
                    setDecryptedMessage('');
                });
        }
    }, [item, EThree, memberCard]);

    useEffect(() => {
        let unsubscribe;
        const onImages = (imagesQuerySnapshot) => {
            if (imagesQuerySnapshot.empty) {
                setDecryptedImages([]);
            } else {
                Promise.all(
                    imagesQuerySnapshot.docs.map((image) =>
                        image.data().user.uid === user.uid
                            ? FirebaseChatMessage.decryptImage(EThree, { id: image.id, ...image.data() })
                            : FirebaseChatMessage.decryptImage(EThree, { id: image.id, ...image.data() }, memberCard),
                    ),
                )
                    .then(setDecryptedImages)
                    .catch((error) => {
                        console.log(error);
                        setDecryptedImages([]);
                    });
            }
        };
        if (EThree && memberCard) {
            unsubscribe = FirebaseChatMessage.initChatImageListener(roomID, item.id, onImages, console.log);
        }
        return () => unsubscribe && unsubscribe();
    }, [item.id, EThree, roomID, memberCard]);

    useEffect(() => {
        let unsubscribe;
        const onReplyMessage = (messageSnapshot) => {
            if (messageSnapshot.data().message) {
                if (messageSnapshot.data().user.uid === user.uid) {
                    EThree.authDecrypt(messageSnapshot.data().message)
                        .then((decryptedMessage) => {
                            setDecryptedAttachedMessage({
                                id: messageSnapshot.id,
                                ...messageSnapshot.data(),
                                message: decryptedMessage,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            setDecryptedAttachedMessage('');
                        });
                } else {
                    EThree.authDecrypt(messageSnapshot.data().message, memberCard)
                        .then((decryptedMessage) => {
                            setDecryptedAttachedMessage({
                                id: messageSnapshot.id,
                                ...messageSnapshot.data(),
                                message: decryptedMessage,
                            });
                        })
                        .catch((error) => {
                            console.log(error);
                            setDecryptedAttachedMessage('');
                        });
                }
            }
        };
        if (memberCard && !item?.deleted && item?.replyToMessageID) {
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
                    attachedMessage={decrypedAttachedMessage}
                    openMessageActionDialog={openMessageActionDialog}
                    openImageDialog={openImageDialog}
                />
                <View style={styles.placeholder} />
            </View>
        );
    }
};

export default DirectMessage;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
    },
    placeholder: {
        flex: 1,
    },
});
