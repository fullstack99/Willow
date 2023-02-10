import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import * as constants from '../../constants/Database';
import * as USER_CONSTANTS from '../../constants/User';
import { INVALID_ARGUMENTS, MISSING_FILENAME, NOT_AUTHENTICATED } from '../../service/firebase_errors';
import axios from 'axios';
import FirebaseAnalytics from '../../service/firebase_analytics';

const CHAT_ROOM_REF = firestore().collection(constants.CHAT_ROOM);
class Chat {
    getCurrentUserFriendList = (followings) => {
        if (!Array.isArray(followings)) return [];
        return followings.filter((following) => following.mutualFriend);
    };

    getCurrentUserChatRooms = (next, error) => {
        return CHAT_ROOM_REF.where('show', 'array-contains', auth().currentUser.uid)
            .orderBy('updated_at', 'desc')
            .onSnapshot({ next, error });
    };

    getCurrentUserNonDMChatRooms = () => {
        return new Promise((resolve, reject) => {
            return CHAT_ROOM_REF.where('type', '!=', 'direct_message')
                .where('members', 'array-contains', auth().currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    resolve(
                        querySnapshot.docs.map((documentSnapshot) => {
                            return { id: documentSnapshot.id, ...documentSnapshot.data() };
                        }),
                    );
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getChatMessagesByRoomID = (roomID, next, error) => {
        return CHAT_ROOM_REF.doc(roomID)
            .collection(constants.CHAT_MESSAGE)
            .orderBy('created_at', 'desc')
            .onSnapshot({ next, error });
    };

    getChatRoomUnread = (roomID, next, error) => {
        if (!auth().currentUser) return;
        return CHAT_ROOM_REF.doc(roomID)
            .collection(constants.CHAT_MESSAGE)
            .where('unread', 'array-contains', auth().currentUser.uid)
            .orderBy('created_at', 'asc')
            .onSnapshot({ next, error });
    };

    getDirectMessageChatRoomByUserID = (userID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!userID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            const roomMembers = [userID, auth().currentUser.uid];

            CHAT_ROOM_REF.where('type', '==', 'direct_message')
                .where('members', 'array-contains-any', roomMembers)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        resolve(null);
                    } else {
                        let foundRoom = null;
                        querySnapshot.forEach((room) => {
                            if (
                                room.data().members.length === roomMembers.length &&
                                room.data().members.every((member) => roomMembers.includes(member)) &&
                                roomMembers.every((member) => room.data().members.includes(member))
                            ) {
                                foundRoom = room;
                            }
                        });
                        resolve(foundRoom);
                    }
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getChatMembers = (roomID, next, error) => {
        return CHAT_ROOM_REF.doc(roomID).collection(constants.CHAT_MEMBER).orderBy('isAdmin', 'desc').onSnapshot({ next, error });
    };

    getChatMemberStatus = (roomID, memberID) => {
        return new Promise((resolve, reject) => {
            if (!roomID || !memberID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }
            return CHAT_ROOM_REF.doc(roomID)
                .collection(constants.CHAT_MEMBER)
                .doc(memberID)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        resolve({ uid: snapshot.id, ...snapshot.data() });
                    } else resolve(null);
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getMessageByID = (roomID, messageID, next, error) => {
        return CHAT_ROOM_REF.doc(roomID).collection(constants.CHAT_MESSAGE).doc(messageID).onSnapshot({ next, error });
    };

    getChatRoomPhotoGallery = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return firestore()
                .collectionGroup(constants.CHAT_IMAGE)
                .where('roomID', '==', roomID)
                .orderBy('created_at', 'desc')
                .get()
                .then((snapshot) => {
                    resolve(
                        snapshot.docs.map((doc) => {
                            return { id: doc.id, ...doc.data() };
                        }),
                    );
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    checkIfAnyUnreadMessage = (next, error) => {
        if (!auth().currentUser) return;

        return firestore()
            .collectionGroup(constants.CHAT_MESSAGE)
            .where('unread', 'array-contains', auth().currentUser.uid)
            .onSnapshot({ next, error });
    };

    updateUnreadMessagesToRead = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .collection(constants.CHAT_MESSAGE)
                .where('unread', 'array-contains', auth().currentUser.uid)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        resolve();
                        return;
                    }
                    const updatePromises = querySnapshot.docs.map((message) =>
                        message.ref.update({ unread: firestore.FieldValue.arrayRemove(auth().currentUser.uid) }),
                    );
                    Promise.all(updatePromises)
                        .then(resolve)
                        .catch((error) => {
                            console.log(error);
                            reject(error);
                            return;
                        });
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    updateChatMemberLastSeen = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }
            if (!roomID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .collection(constants.CHAT_MEMBER)
                .doc(auth().currentUser.uid)
                .get()
                .then((memberSnapshot) => {
                    if (memberSnapshot.exists) {
                        memberSnapshot.ref
                            .update({ last_seen: firestore.FieldValue.serverTimestamp() })
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    } else resolve();
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    uploadChatAvatar = async (avatar, roomId = null) => {
        try {
            const filename = avatar.split('/').pop();
            if (!filename) throw { code: MISSING_FILENAME };
            let storagePath = `${constants.CHAT_ROOM}/${filename}`;
            if (roomId) storagePath = `${constants.CHAT_ROOM}/${roomId}/photo/${filename}`;
            await storage().ref(storagePath).putFile(`file://${avatar}`);
            const avatar_url = await storage().ref(storagePath).getDownloadURL();
            return { avatar_url, filename };
        } catch (error) {
            throw error;
        }
    };

    deleteImage = (roomId, filenames) => {
        try {
            filenames.forEach(async (filename) => {
                const storagePath = `${constants.CHAT_ROOM}/${roomId}/photo/${filename}`;
                await storage().ref(storagePath).delete();
            });
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    deleteAudio = async (roomId, filename) => {
        try {
            const storagePath = `${constants.CHAT_ROOM}/${roomId}/audio/${filename}`;
            await storage().ref(storagePath).delete();
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    uploadAudio = async (audio, roomId, userId) => {
        try {
            const timestamp = new Date().getTime();
            const filename = `${userId}-${timestamp}-${audio.split('/').pop()}`;
            if (!filename) throw { code: MISSING_FILENAME };
            const storagePath = `${constants.CHAT_ROOM}/${roomId}/audio/${filename}`;
            await storage().ref(storagePath).putFile(`file://${audio}`);
            const audio_url = await storage().ref(storagePath).getDownloadURL();
            return { audio_url, filename };
        } catch (error) {
            throw error;
        }
    };

    getAllMedia = async (roomId) => {
        try {
            const storagePath = `${constants.CHAT_ROOM}/${roomId}/photo`;
            const mediaLists = await storage().ref(storagePath).listAll();
            const actions = mediaLists._items.map(async (v) => {
                v.path = await storage().ref(v.path).getDownloadURL();
            });
            await Promise.all(actions);
            return mediaLists;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    getAllAudio = async (roomId) => {
        try {
            const storagePath = `${constants.CHAT_ROOM}/${roomId}/audio`;
            const audioLists = await storage().ref(storagePath).listAll();
            const actions = audioLists._items.map(async (v) => {
                v.path = await storage().ref(v.path).getDownloadURL();
            });
            await Promise.all(actions);
            return audioLists;
        } catch (error) {
            console.log(error);
            throw error;
        }
    };

    sendMessage = async (roomID, user, otherUsers, message, imagesData) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }
            if (!roomID || !Array.isArray(otherUsers) || (!message && !Array.isArray(imagesData) && imagesData.length === 0)) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .collection(constants.CHAT_MESSAGE)
                .add({
                    type: message ? 'text' : 'images',
                    message,
                    images: [],
                    number_of_images: 0,
                    user: {
                        uid: user.uid,
                        [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
                        [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                        [USER_CONSTANTS.AVATAR_URL]: user[USER_CONSTANTS.AVATAR_URL],
                    },
                    hide: [],
                    likes: [],
                    unread: otherUsers,
                    created_at: firestore.FieldValue.serverTimestamp(),
                })
                .then((messageRef) => {
                    FirebaseAnalytics.logMessageSent(messageRef.id);
                    if (!Array.isArray(imagesData) || imagesData.length === 0) resolve();
                    Promise.all(
                        imagesData.map((image) =>
                            messageRef.collection(constants.CHAT_IMAGE).add({
                                messageID: messageRef.id,
                                roomID,
                                ...image,
                                user: {
                                    uid: user.uid,
                                    [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
                                    [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                                    [USER_CONSTANTS.AVATAR_URL]: user[USER_CONSTANTS.AVATAR_URL],
                                },
                                hide: [],
                                likes: [],
                                created_at: firestore.FieldValue.serverTimestamp(),
                            }),
                        ),
                    )
                        .then(resolve)
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
        // try {
        //     const response = await axios({
        //         method: 'POST',
        //         url: '/api/chat/message',
        //         data: data,
        //     });
        //     return response;
        // } catch (err) {
        //     return err;
        // }
    };

    replyMessage = (roomID, user, replyToMessageID, otherUsers, replyMessage, imagesData) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }
            if (!roomID || !replyToMessageID || !Array.isArray(otherUsers) || (!replyMessage && !imagesData?.length === 0)) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .collection(constants.CHAT_MESSAGE)
                .add({
                    replyToMessageID,
                    message: replyMessage,
                    type: replyMessage ? 'text' : 'images',
                    images: [],
                    number_of_images: 0,
                    user: {
                        uid: user.uid,
                        [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
                        [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                        [USER_CONSTANTS.AVATAR_URL]: user[USER_CONSTANTS.AVATAR_URL],
                    },
                    created_at: firestore.FieldValue.serverTimestamp(),
                    hide: [],
                    likes: [],
                    unread: otherUsers,
                })
                .then((messageRef) => {
                    FirebaseAnalytics.logMessageSent(messageRef.id);
                    if (!Array.isArray(imagesData) || imagesData.length === 0) resolve();
                    Promise.all(
                        imagesData.map((image) =>
                            messageRef.collection(constants.CHAT_IMAGE).add({
                                messageID: messageRef.id,
                                roomID,
                                ...image,
                                user: {
                                    uid: user.uid,
                                    [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
                                    [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                                    [USER_CONSTANTS.AVATAR_URL]: user[USER_CONSTANTS.AVATAR_URL],
                                },
                                hide: [],
                                likes: [],
                                created_at: firestore.FieldValue.serverTimestamp(),
                            }),
                        ),
                    )
                        .then(resolve)
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    editMessage = (roomID, user, messageID, editedMessage, newImages) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }
            if (!roomID || !messageID || !editedMessage || !user) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            const editMessagePromises = [
                CHAT_ROOM_REF.doc(roomID)
                    .collection(constants.CHAT_MESSAGE)
                    .doc(messageID)
                    .update({
                        type: editedMessage ? 'text' : 'images',
                        message: editedMessage,
                        edited_at: firestore.FieldValue.serverTimestamp(),
                    }),
            ];

            if (Array.isArray(newImages) && newImages.length > 0) {
                editMessagePromises.concat(
                    newImages.map((image) =>
                        CHAT_ROOM_REF.doc(roomID)
                            .collection(constants.CHAT_MESSAGE)
                            .doc(messageID)
                            .collection(constants.CHAT_IMAGE)
                            .add({
                                messageID,
                                roomID,
                                ...image,
                                user: {
                                    uid: user.uid,
                                    [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
                                    [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                                    [USER_CONSTANTS.AVATAR_URL]: user[USER_CONSTANTS.AVATAR_URL],
                                },
                                hide: [],
                                likes: [],
                                created_at: firestore.FieldValue.serverTimestamp(),
                            }),
                    ),
                );
            }

            return Promise.all(editMessagePromises)
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
        // try {
        //     const response = await axios({
        //         method: 'PUT',
        //         url: `/api/chat/message/${id}`,
        //         data: data,
        //     });
        //     return response;
        // } catch (err) {
        //     return err;
        // }
    };

    likeImage = (image) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }
            if (!image || !image?.id || !image?.roomID || !image?.messageID || !Array.isArray(image?.likes)) {
                console.log('haha');
                reject({ code: INVALID_ARGUMENTS });
                return;
            }
            const roomID = image.roomID;
            const messageID = image.messageID;
            const likes = image.likes;

            return CHAT_ROOM_REF.doc(roomID)
                .collection(constants.CHAT_MESSAGE)
                .doc(messageID)
                .collection(constants.CHAT_IMAGE)
                .doc(image.id)
                .update({
                    likes:
                        likes.indexOf(auth().currentUser.uid) === -1
                            ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                            : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    likeMessage = (roomID, messageID, like) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID || !messageID || typeof like !== 'boolean') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .collection(constants.CHAT_MESSAGE)
                .doc(messageID)
                .update({
                    likes: like
                        ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                        : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
        // try {
        //     const response = await axios({
        //         method: 'PUT',
        //         url: `/api/chat/message/like/${params.messageId}`,
        //         data: {
        //             roomId: params.roomId,
        //             userId: params.userId,
        //         },
        //     });
        //     return response;
        // } catch (err) {
        //     return err;
        // }
    };

    deleteMessage = (roomID, messageID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID || !messageID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            const query = CHAT_ROOM_REF.doc(roomID).collection(constants.CHAT_MESSAGE).doc(messageID);

            return query
                .collection(constants.CHAT_IMAGE)
                .get()
                .then((response) => {
                    if (response.empty) {
                        query
                            .update({ message: null, deleted: true, likes: [] })
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    } else {
                        Promise.all([
                            CHAT_ROOM_REF.doc(roomID)
                                .collection(constants.CHAT_MESSAGE)
                                .doc(messageID)
                                .update({ message: null, deleted: true, likes: [] }),
                            ...response.docs.map((image) => query.collection(constants.CHAT_IMAGE).doc(image.id).delete()),
                        ])
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    }
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    createChatRoom = async (data) => {
        try {
            const currentRoomsQuerySnapshot = await CHAT_ROOM_REF.where('type', '!=', 'public_forum')
                .where('members', 'array-contains-any', data.members)
                .get();
            if (currentRoomsQuerySnapshot.size > 0) {
                let foundRoom = null;
                currentRoomsQuerySnapshot.forEach((room) => {
                    if (
                        room.data().members.length === data.members.length &&
                        room.data().members.every((member) => data.members.includes(member)) &&
                        data.members.every((member) => room.data().members.includes(member))
                    ) {
                        foundRoom = room.ref;
                    }
                });
                if (foundRoom) {
                    foundRoom.update &&
                        (await foundRoom.update({ show: firestore.FieldValue.arrayUnion(auth().currentUser.uid) }));
                    return foundRoom;
                }
            }
            const chatRoomRef = await CHAT_ROOM_REF.add({
                ...data,
                show: data?.members || [],
                muted: [],
                pinned: [],
                created_at: firestore.FieldValue.serverTimestamp(),
                updated_at: firestore.FieldValue.serverTimestamp(),
            });

            return chatRoomRef;
        } catch (error) {
            console.log(error);
            throw error;
        }
        // try {
        //     const response = await axios({
        //         method: 'POST',
        //         url: '/api/chat/room',
        //         data: data,
        //     });
        //     return response;
        // } catch (err) {
        //     return err;
        // }
    };

    addNewMembersToChatRoom = (roomID, memberIDs) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID || !Array.isArray(memberIDs)) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .update({
                    members: firestore.FieldValue.arrayUnion(...memberIDs),
                    show: firestore.FieldValue.arrayUnion(...memberIDs),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    deleteChatRoom = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .update({
                    show: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                })
                .then(resolve)
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
        // try {
        //     const response = await axios.delete(`/api/chat/room/${id}`);
        //     return response;
        // } catch (err) {
        //     return err;
        // }
    };

    getChatRoom = (roomID, next, error) => {
        if (!auth().currentUser || !roomID || !next || !error) return;
        return CHAT_ROOM_REF.doc(roomID).onSnapshot({ next, error });
        // try {
        //     const response = await axios.get(`/api/chat/room/${id}`);
        //     return response;
        // } catch (err) {
        //     return err;
        // }
    };

    updatePrivateGroupName = async (roomID, name) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .update({
                    name,
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    pinChatRoom = (roomID, isPinning) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID || typeof isPinning !== 'boolean') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .update({
                    pinned: isPinning
                        ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                        : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    muteChatRoom = (roomID, isMuting) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID || typeof isMuting !== 'boolean') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .update({
                    muted: isMuting
                        ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                        : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    deleteChatRoom = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .delete()
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getChatMessgeByRoomId = async (roomId, count) => {
        try {
            const response = await axios.get(`/api/chat/message/${roomId}?count=${count}`);
            return response;
        } catch (err) {
            return err;
        }
    };

    getUserChatRooms = async (userId) => {
        try {
            const response = await axios.get(`/api/chat/rooms/user/${userId}`);
            return response;
        } catch (err) {
            return err;
        }
    };

    deleteMembers = async (roomId, data) => {
        try {
            const response = await axios({
                method: 'DELETE',
                url: `/api/chat/room/user/${roomId}`,
                data: data,
            });
            return response;
        } catch (err) {
            return err;
        }
    };

    updatePublicGroup = async (roomId, data) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `/api/chat/room/public/${roomId}`,
                data: data,
            });
            return response;
        } catch (err) {
            return err;
        }
    };

    getPublicChatRooms = async (userId) => {
        try {
            const response = await axios.get(`/api/chat/rooms/public/${userId}`);
            return response;
        } catch (err) {
            return err;
        }
    };

    pollVoted = async (params) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `/api/chat/message/poll/vote/${params.messageId}`,
                data: {
                    roomId: params.roomId,
                    userId: params.userId,
                    answer: params.answer,
                },
            });
            return response;
        } catch (err) {
            return err;
        }
    };

    retractVote = async (params) => {
        try {
            const response = await axios({
                method: 'PUT',
                url: `/api/chat/message/poll/retract/${params.messageId}`,
                data: {
                    roomId: params.roomId,
                    userId: params.userId,
                },
            });
            return response;
        } catch (err) {
            return err;
        }
    };
}

export default new Chat();
