import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, SafeAreaView, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Clipboard from '@react-native-community/clipboard';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import { CHATTING_MEMBERS, USER_PROFILE } from '../../../navigator/constants';
import { discardAlert } from '../../../utility';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import FirebaseChat from '../../../service/firebase_requests/Chat';
import FirebaseChatMessage from '../../../service/firebase_requests/ChatMessage';
import FirebaseErrors, { INVALID_ARGUMENTS, SERVER_ERROR } from '../../../service/firebase_errors';
import EThreeService from '../../../service/virgil_security';
import Toast from '../../../components/Toast';
import DirectMessage from '../../../components/Chat/Private/Direct/DirectMessage';
import GroupMessage from '../../../components/Chat/Private/Group/GroupMessage';
import ForumMessage from '../../../components/Chat/Public/ForumMessage';
import InputBar from '../../../components/Chat/InputBar';
import ChatTimeSection from '../../../components/Chat/ChatTimeSection';
import ChatRoomTitle from '../../../components/Chat/ChatRoomTitle';
import ChatRoomAvatar from '../../../components/Chat/ChatRoomAvatar';
import MessageActionsDialog from '../../../components/Chat/MessageActionsDialog';
import MessageLikesDialog from '../../../components/Chat/MessageLikesDialog';
import ImageDialog from '../../../components/Chat/ImageDialog';

const ChatRoom = ({ navigation, route }) => {
    const roomID = route.params?.room?.id || route.params.roomID;
    const user = useSelector((state) => state.auth.user);
    const insets = useSafeAreaInsets();
    const [room, setRoom] = useState(route.params?.room || null);
    const [members, setMembers] = useState(route.params?.room?.members.filter((uid) => uid !== user.uid) || null);
    const [EThree, setEThree] = useState(EThreeService.getEthree());
    const [GroupsEThree, setGroupsEThree] = useState(null);
    const [memberCard, setMemberCard] = useState(route.params?.memberCard || null);
    const [init, setInit] = useState(roomID ? true : false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [messages, setMessages] = useState([[]]);
    const [selectedMessage, setSelectedMessage] = useState(null);
    const [selectedImage, setSelectedImage] = useState(null);
    const [editing, setEditing] = useState(false);
    const [replying, setReplying] = useState(false);
    const messageActionRef = useRef();
    const messageLikesRef = useRef();
    const messageListRef = useRef();
    const messageImageRef = useRef();

    // Pagination
    const PAGE_LIMIT = 20;
    const listeners = useRef([]);
    const [refreshing, setRefreshing] = useState(true);
    const [hasMore, setHasMore] = useState(true);

    useEffect(() => () => listeners.current.map((unsubscribe) => unsubscribe()), []);

    useEffect(() => {
        if (!refreshing) return;
        let mounted = true;
        FirebaseChatMessage.initChatMessagesListener(
            mounted,
            roomID,
            messages,
            PAGE_LIMIT,
            listeners,
            setMessages,
            setHasMore,
            setRefreshing,
        );
    }, [roomID, refreshing]);

    // Chat Room Header
    useLayoutEffect(() => {
        room?.type &&
            Array.isArray(members) &&
            navigation.setOptions({
                title: (
                    <ChatRoomTitle
                        room={room}
                        users={members}
                        onSubTitlePress={() => {
                            switch (room.type) {
                                case 'public_forum':
                                case 'private_group':
                                    return navigateToChatMembers();
                                case 'direct_message':
                                    return navigation && navigation.push(USER_PROFILE, { userID: members[0] });
                                default:
                                    return;
                            }
                        }}
                    />
                ),
                headerStyle: { height: 100 },
                headerRight: () => <ChatRoomAvatar navigation={navigation} room={room} users={members} />,
            });
    }, [navigation, room, members]);

    // Chat Member's Last Seen Updates
    useEffect(() => {
        roomID && FirebaseChat.updateChatMemberLastSeen(roomID).catch(console.log);
        return () => roomID && FirebaseChat.updateChatMemberLastSeen(roomID).catch(console.log);
    }, [roomID]);

    // Chat Message's Unread Updates
    useEffect(() => {
        FirebaseChat.updateUnreadMessagesToRead(roomID).catch(console.log);
    }, [roomID, messages]);

    // Chat Room's listener
    useEffect(() => {
        const unsubscribe = FirebaseChat.getChatRoom(
            roomID,
            (roomSnapshot) => setRoom({ id: roomSnapshot.id, ...roomSnapshot.data() }),
            console.log,
        );
        return unsubscribe;
    }, [roomID]);

    // EThree Initialize
    useEffect(() => {
        if (!EThree) EThreeService.initialize().then(setEThree).catch(console.log);
    }, [EThree]);

    // GroupsEThree Initiate (if Private Group)
    useEffect(() => {
        if (EThree && room?.id && room?.owner && room?.type === 'private_group') {
            EThreeService.getGroupEThree(room.id, room.owner).then(setGroupsEThree).catch(console.log);
        }
    }, [EThree, room?.id, room?.type, room?.owner, room?.members]);

    // Members Card Init (Direct Message only)
    useEffect(() => {
        if (!room || !Array.isArray(room?.members) || !room.type) {
            return;
        } else if (!Array.isArray(members)) {
            user?.uid ? setMembers(room.members.filter((uid) => uid !== user.uid) || []) : setMembers([]);
        } else if (EThree && room.type === 'direct_message' && Array.isArray(members) && members.length === 1 && !memberCard) {
            EThree.findUsers(members[0])
                .then(setMemberCard)
                .catch((error) => {
                    FirebaseErrors.setError(error, setError);
                    setInit(false);
                });
        }
    }, [user, room, members, EThree, memberCard]);

    // Members Card (Private Group only)
    useEffect(() => {
        if (room?.type === 'private_group' && Array.isArray(room?.members)) {
            user?.uid ? setMembers(room.members.filter((uid) => uid !== user.uid) || []) : setMembers([]);
            EThreeService.getGroupMembersCard(room.members).then(setMemberCard).catch(console.log);
        }
    }, [user, room?.members]);

    // Init Check
    useEffect(() => {
        if (
            room?.id &&
            Array.isArray(members) &&
            (room.type === 'public_forum' || (room.type !== 'public_forum' && memberCard))
        ) {
            setInit(false);
        }
    }, [room, members, memberCard]);

    const navigateToChatMembers = () => {
        return navigation && navigation.push(CHATTING_MEMBERS, { roomID });
    };

    const onSendMessage = async (message, images) => {
        try {
            setLoading(true);
            if (!Array.isArray(members) || !room.type) throw { code: INVALID_ARGUMENTS };
            else if (room.type === 'public_forum') {
                const imagesData = (await FirebaseChatMessage.uploadPublicImages(roomID, images)) || [];
                return FirebaseChat.sendMessage(roomID, user, members, message, imagesData);
            } else if (EThree && room.type === 'direct_message' && memberCard) {
                const encryptedMessage = message ? await EThree.authEncrypt(message, memberCard) : '';
                const encryptedImages =
                    images?.length > 0
                        ? await Promise.all(
                              images.map((image) => EThree.authEncrypt({ value: image.data, encoding: 'base64' }, memberCard)),
                          )
                        : [];
                const encryptedImagesWithFileName = encryptedImages.map((item, index) => {
                    return { data: item, filename: images[index].filename, mime: images[index].mime };
                });
                const imagesData = await FirebaseChatMessage.uploadEncryptedImages(roomID, encryptedImagesWithFileName);
                return FirebaseChat.sendMessage(roomID, user, members, encryptedMessage, imagesData);
            } else if (GroupsEThree && room.type === 'private_group') {
                const encryptedMessage = message ? await GroupsEThree.encrypt(message) : '';
                // const encryptedImages =
                //     images?.length > 0
                //         ? await Promise.all(
                //               images.map((image) => GroupsEThree.encrypt({ value: image.data, encoding: 'base64' })),
                //           )
                //         : [];
                // const encryptedImagesWithFileName = encryptedImages.map((item, index) => {
                //     return { data: item, filename: images[index].filename, mime: images[index].mime };
                // });
                // const imagesData = await FirebaseChatMessage.uploadEncryptedImages(roomID, encryptedImagesWithFileName);
                const imagesData = (await FirebaseChatMessage.uploadPublicImages(roomID, images)) || [];
                return FirebaseChat.sendMessage(roomID, user, members, encryptedMessage, imagesData);
            } else {
                throw { code: SERVER_ERROR };
            }
        } catch (error) {
            FirebaseErrors.setError(error, setError);
        } finally {
            setLoading(false);
        }
    };

    const onEditOrReply = async (message, images) => {
        try {
            setLoading(true);
            if (editing) {
                const newImages = images.filter((image) => !image.image_url);
                if (room.type === 'public_forum') {
                    const imagesData = await FirebaseChatMessage.uploadPublicImages(roomID, newImages);
                    await FirebaseChat.editMessage(roomID, user, selectedMessage.id, message, imagesData);
                } else if (GroupsEThree && room.type === 'private_group') {
                    const encryptedMessage = message ? await GroupsEThree.encrypt(message) : '';
                    // const encryptedImages =
                    //     newImages?.length > 0
                    //         ? await Promise.all(
                    //               newImages.map((image) => GroupsEThree.encrypt({ value: image.data, encoding: 'base64' })),
                    //           )
                    //         : [];
                    // const encryptedImagesWithFileName = encryptedImages.map((item, index) => {
                    //     return { data: item, filename: newImages[index].filename, mime: newImages[index].mime };
                    // });
                    // const imagesData = await FirebaseChatMessage.uploadEncryptedImages(roomID, encryptedImagesWithFileName);
                    const imagesData = await FirebaseChatMessage.uploadPublicImages(roomID, newImages);
                    await FirebaseChat.editMessage(roomID, user, selectedMessage.id, encryptedMessage, imagesData);
                } else if (EThree && memberCard) {
                    const encryptedMessage = message ? await EThree.authEncrypt(message, memberCard) : '';
                    const encryptedImages =
                        newImages?.length > 0
                            ? await Promise.all(
                                  newImages.map((image) =>
                                      EThree.authEncrypt({ value: image.data, encoding: 'base64' }, memberCard),
                                  ),
                              )
                            : [];
                    const encryptedImagesWithFileName = encryptedImages.map((item, index) => {
                        return { data: item, filename: newImages[index].filename, mime: newImages[index].mime };
                    });
                    const imagesData = await FirebaseChatMessage.uploadEncryptedImages(roomID, encryptedImagesWithFileName);
                    await FirebaseChat.editMessage(roomID, user, selectedMessage.id, encryptedMessage, imagesData);
                } else {
                    setError('failed to edit message. please try again');
                    setTimeout(() => setError(''), 4000);
                }
            } else if (replying) {
                if (!Array.isArray(members)) {
                    setError('failed to edit message. please try again');
                    setTimeout(() => setError(''), 4000);
                } else if (room.type === 'public_forum') {
                    const imagesData = (await FirebaseChatMessage.uploadPublicImages(roomID, images)) || [];
                    await FirebaseChat.replyMessage(roomID, user, selectedMessage.id, members, message, imagesData);
                } else if (GroupsEThree && room.type === 'private_group') {
                    const encryptedMessage = await GroupsEThree.encrypt(message);
                    // const encryptedImages =
                    //     images?.length > 0
                    //         ? await Promise.all(
                    //               images.map((image) => GroupsEThree.encrypt({ value: image.data, encoding: 'base64' })),
                    //           )
                    //         : [];
                    // const encryptedImagesWithFileName = encryptedImages.map((item, index) => {
                    //     return { data: item, filename: images[index].filename, mime: images[index].mime };
                    // });
                    // const imagesData = await FirebaseChatMessage.uploadEncryptedImages(roomID, encryptedImagesWithFileName);
                    const imagesData = (await FirebaseChatMessage.uploadPublicImages(roomID, images)) || [];
                    await FirebaseChat.replyMessage(roomID, user, selectedMessage.id, members, encryptedMessage, imagesData);
                } else if (EThree && memberCard) {
                    const encryptedMessage = await EThree.authEncrypt(message, memberCard);
                    const encryptedImages =
                        images?.length > 0
                            ? await Promise.all(
                                  images.map((image) =>
                                      EThree.authEncrypt({ value: image.data, encoding: 'base64' }, memberCard),
                                  ),
                              )
                            : [];
                    const encryptedImagesWithFileName = encryptedImages.map((item, index) => {
                        return { data: item, filename: images[index].filename, mime: images[index].mime };
                    });
                    const imagesData = await FirebaseChatMessage.uploadEncryptedImages(roomID, encryptedImagesWithFileName);
                    await FirebaseChat.replyMessage(roomID, user, selectedMessage.id, members, encryptedMessage, imagesData);
                } else {
                    setError('failed to edit message. please try again');
                    setTimeout(() => setError(''), 4000);
                }
            } else {
            }
        } catch (error) {
            console.log(error);
            setError('server error. please try again');
            setTimeout(() => setError(''), 4000);
        } finally {
            closeEditOrReplyMode();
        }
    };

    const openMessageActionDialog = (message) => {
        closeEditOrReplyMode();
        setSelectedMessage(message);
        messageActionRef.current && messageActionRef.current.open();
    };

    const openMessageLikesDialog = (message) => {
        closeEditOrReplyMode();
        setSelectedMessage(message);
        messageLikesRef.current && messageLikesRef.current.open();
    };

    const openImageDialog = (message, image) => {
        closeEditOrReplyMode();
        setSelectedMessage(message);
        setSelectedImage(image);
        messageImageRef.current && messageImageRef.current.open();
    };

    const handleDeleteMessage = () => {
        messageActionRef.current && messageActionRef.current.close();
        setTimeout(
            () =>
                roomID &&
                selectedMessage.id &&
                discardAlert(
                    () => FirebaseChat.deleteMessage(roomID, selectedMessage.id),
                    'delete',
                    'are you sure you want to delete this?',
                    'delete',
                    'cancel',
                ),
            500,
        );
        // roomID && selectedMessage.id && FirebaseChat.deleteMessage(roomID, selectedMessage.id);
    };
    const handleCopyMessage = () => {
        messageActionRef.current && messageActionRef.current.close();
        Clipboard.setString(selectedMessage.message || selectedMessage?.product?.title);
    };
    const handleLikeMessage = () => {
        messageActionRef.current && messageActionRef.current.close();
        messageImageRef.current && messageImageRef.current.close();
        if (!selectedMessage && !selectedImage) return;
        if (selectedImage) {
            FirebaseChat.likeImage(selectedImage);
        } else {
            FirebaseChat.likeMessage(roomID, selectedMessage.id, selectedMessage.likes.indexOf(user?.uid) === -1);
        }
    };
    const handleEditMessage = () => {
        messageActionRef.current && messageActionRef.current.close();
        setEditing(true);
    };
    const handleReplyMessage = () => {
        messageActionRef.current && messageActionRef.current.close();
        setReplying(true);
    };

    const handleDeleteImage = () => {
        messageImageRef.current && messageImageRef.current.close();
        setTimeout(
            () =>
                selectedMessage &&
                selectedImage &&
                discardAlert(
                    () => {
                        FirebaseChatMessage.deleteImage(selectedImage).catch((error) => FirebaseErrors.setError(error, setError));
                    },
                    'delete image',
                    'are you sure you want to delete this image?',
                    'delete',
                    'cancel',
                ),
            500,
        );
    };

    const handleEndPoll = () => {
        messageActionRef.current && messageActionRef.current.close();
        setTimeout(
            () =>
                selectedMessage &&
                discardAlert(
                    () => {
                        FirebaseChatMessage.endPoll(roomID, selectedMessage.id).catch((error) =>
                            FirebaseErrors.setError(error, setError),
                        );
                    },
                    'end poll',
                    'are you sure you want to end this poll?',
                    'end',
                    'cancel',
                ),
            500,
        );
    };

    const closeEditOrReplyMode = () => {
        setEditing(false);
        setReplying(false);
        setLoading(false);
        setSelectedMessage(null);
        setSelectedImage(null);
        Keyboard.dismiss();
    };

    const onPaginate = () => {
        hasMore && setRefreshing(true);
    };

    if (!room || !Array.isArray(members) || (!room.type === 'public_forum' && !memberCard))
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <View style={styles.messageListContainer} />
                <InputBar init navigation={navigation} room={room} onSendMessage={onSendMessage} setError={setError} />
            </SafeAreaView>
        );
    else if (init) {
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <LoadingDotsOverlay animation={init} />
                <View style={styles.messageListContainer} />
                <InputBar init navigation={navigation} room={room} onSendMessage={onSendMessage} setError={setError} />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <View style={styles.messageListContainer}>
                    <FlatList
                        ref={messageListRef}
                        data={messages.flat()}
                        style={{ flexGrow: 0 }}
                        inverted
                        onEndReached={onPaginate}
                        onEndReachedThreshold={0.4}
                        keyboardShouldPersistTaps="handled"
                        keyExtractor={(item) => item.id}
                        renderItem={({ item, index }) => {
                            switch (room.type) {
                                case 'direct_message':
                                    return (
                                        <View>
                                            <ChatTimeSection
                                                currMsg={item}
                                                prevMsg={
                                                    index === messages.flat().length ? undefined : messages.flat()[index + 1]
                                                }
                                                index={index}
                                            />
                                            <DirectMessage
                                                navigation={navigation}
                                                roomID={roomID}
                                                room={room}
                                                item={item}
                                                memberCard={memberCard}
                                                openMessageActionDialog={openMessageActionDialog}
                                                openImageDialog={openImageDialog}
                                            />
                                        </View>
                                    );
                                case 'private_group':
                                    return (
                                        <View>
                                            <ChatTimeSection
                                                currMsg={item}
                                                prevMsg={
                                                    index === messages.flat().length ? undefined : messages.flat()[index + 1]
                                                }
                                                index={index}
                                            />
                                            <GroupMessage
                                                navigation={navigation}
                                                roomID={roomID}
                                                room={room}
                                                item={item}
                                                GroupsEThree={GroupsEThree}
                                                memberCard={memberCard}
                                                openMessageActionDialog={openMessageActionDialog}
                                                openMessageLikesDialog={openMessageLikesDialog}
                                                openImageDialog={openImageDialog}
                                            />
                                        </View>
                                    );
                                case 'public_forum':
                                    return (
                                        <View>
                                            <ChatTimeSection
                                                currMsg={item}
                                                prevMsg={
                                                    index === messages.flat().length ? undefined : messages.flat()[index + 1]
                                                }
                                                index={index}
                                            />
                                            <ForumMessage
                                                navigation={navigation}
                                                roomID={roomID}
                                                room={room}
                                                item={item}
                                                openMessageActionDialog={openMessageActionDialog}
                                                openMessageLikesDialog={openMessageLikesDialog}
                                                openImageDialog={openImageDialog}
                                            />
                                        </View>
                                    );
                                default:
                                    return;
                            }
                        }}
                        contentContainerStyle={styles.messageListContentContainer}
                    />
                </View>
                <InputBar
                    init={false}
                    loading={loading}
                    navigation={navigation}
                    onSendMessage={onSendMessage}
                    onEditOrReply={onEditOrReply}
                    onClose={closeEditOrReplyMode}
                    setError={setError}
                    room={room}
                    attachedMessage={selectedMessage}
                    editing={editing}
                    replying={replying}
                />
                <KeyboardSpacer topSpacing={-insets.bottom} />

                <ImageDialog
                    forwardRef={messageImageRef}
                    selectedImage={selectedImage}
                    handleLikeImage={handleLikeMessage}
                    handleDeleteImage={handleDeleteImage}
                    handleReplyImage={() => {}}
                />
                <MessageActionsDialog
                    forwardRef={messageActionRef}
                    selectedMessage={selectedMessage}
                    handleLikeMessage={handleLikeMessage}
                    handleDeleteMessage={handleDeleteMessage}
                    handleEditMessage={handleEditMessage}
                    handleCopyMessage={handleCopyMessage}
                    handleReplyMessage={handleReplyMessage}
                    handleEndPoll={handleEndPoll}
                />
                <MessageLikesDialog forwardRef={messageLikesRef} selectedMessage={selectedMessage} navigation={navigation} />
            </SafeAreaView>
        );
    }
};

export default ChatRoom;

const styles = StyleSheet.create({
    messageListContainer: {
        flexGrow: 1,
        flexShrink: 1,
    },
    messageListContentContainer: {
        padding: 20,
    },
});
