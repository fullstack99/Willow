import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import { Buffer } from 'buffer';
import RNFetchBlob from 'rn-fetch-blob';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as USER_CONSTANTS from '../../constants/User';
import * as ERROR_CONSTANTS from '../../service/firebase_errors/constants';
import FirebaseChat from './Chat';

const CHAT_ROOM_REF = firestore().collection(DATABASE_CONSTANTS.CHAT_ROOM);

class ChatMessage {
    // Get
    getMessageByID = (roomID, messageID, next, error) => {
        return CHAT_ROOM_REF.doc(roomID).collection(DATABASE_CONSTANTS.CHAT_MESSAGE).doc(messageID).onSnapshot({ next, error });
    };

    initChatMessagesListener = (mounted, roomID, messages, pageLimit, listeners, setMessages, setHasMore, setRefreshing) => {
        const l = messages.length;
        const page = messages[l - 1];
        const lastMessage = page[page.length - 1];
        const query = firestore()
            .collection(DATABASE_CONSTANTS.CHAT_ROOM)
            .doc(roomID)
            .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
            .orderBy('created_at', 'desc')
            .startAfter(lastMessage?.created_at || new Date(253402300799999));
        query
            .limit(pageLimit)
            .get()
            .then((snapshot) => {
                if (mounted) {
                    const data = snapshot.docs.map((doc) => {
                        return { id: doc.id, ...doc.data() };
                    });
                    setMessages((ps) => ps.concat([data]));
                    const unsubscribe = query.endAt(data[data.length - 1]?.created_at || new Date()).onSnapshot(
                        (snapshot) => {
                            const dataUpdated = snapshot.docs.map((doc) => {
                                return { id: doc.id, ...doc.data() };
                            });
                            setMessages((ps) => ps.map((b, i) => (i === l ? dataUpdated : b)));
                        },
                        (error) => console.log(error),
                    );
                    listeners.current = listeners.current.concat([unsubscribe]);
                    setHasMore(data.length === pageLimit);
                    setRefreshing(false);
                }
            })
            .catch((error) => {
                console.log('messages listeners error');
                console.log(error);
            });
    };
    initChatImageListener = (roomID, messageID, next, error) => {
        return firestore()
            .collection(DATABASE_CONSTANTS.CHAT_ROOM)
            .doc(roomID)
            .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
            .doc(messageID)
            .collection(DATABASE_CONSTANTS.CHAT_IMAGE)
            .onSnapshot({ next, error });
    };

    initChatPollOptionsListener = (roomID, messageID, next, error) => {
        if (!roomID || !messageID) return;
        return firestore()
            .collection(DATABASE_CONSTANTS.CHAT_ROOM)
            .doc(roomID)
            .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
            .doc(messageID)
            .collection(DATABASE_CONSTANTS.CHAT_POLL_OPTION)
            .orderBy('index', 'asc')
            .onSnapshot({ next, error });
    };
    // Message Images
    uploadPublicImages = (roomID, images) => {
        return new Promise((resolve, reject) => {
            const uploadImages = (roomID, image) => {
                return new Promise((resolve, reject) => {
                    const storagePath = `${DATABASE_CONSTANTS.CHAT_ROOM_PIC}/${roomID}/${image.filename}`;
                    return storage()
                        .ref(storagePath)
                        .putString(image.data, storage.StringFormat.BASE64)
                        .then(() => {
                            storage()
                                .ref(storagePath)
                                .getDownloadURL()
                                .then((url) =>
                                    resolve({
                                        path: storage().ref(storagePath).fullPath,
                                        image_url: url,
                                        filename: image.filename,
                                        mime: image.mime,
                                        encrypted: false,
                                    }),
                                )
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

            return Promise.all(images.map((image) => uploadImages(roomID, image)))
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };
    uploadEncryptedImages = (roomID, images) => {
        const uploadEncryptedFile = (roomID, image) => {
            return new Promise((resolve, reject) => {
                const storagePath = `${DATABASE_CONSTANTS.CHAT_ROOM_PIC}/${roomID}/${image.filename}`;
                return storage()
                    .ref(storagePath)
                    .put(image.data)
                    .then(() => {
                        storage()
                            .ref(storagePath)
                            .getDownloadURL()
                            .then((url) =>
                                resolve({
                                    path: storage().ref(storagePath).fullPath,
                                    image_url: url,
                                    filename: image.filename,
                                    mime: image.mime,
                                    encrypted: true,
                                }),
                            )
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

        return new Promise((resolve, reject) => {
            return Promise.all(images.map((image) => uploadEncryptedFile(roomID, image)))
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };
    decryptImage = (EThree, image, memberCard) => {
        return new Promise((resolve, reject) => {
            if (!EThree || !image || !image?.image_url) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            if (memberCard) {
                return RNFetchBlob.fetch('GET', image.image_url)
                    .then((response) => {
                        response.respInfo.status === 200 &&
                            EThree.authDecrypt({ value: response.data, encoding: 'base64' }, memberCard)
                                .then((result) => {
                                    resolve({
                                        ...image,
                                        image_url: `data:${image?.mime || 'image/jpg'};base64,${Buffer.from(result).toString(
                                            'base64',
                                        )}`,
                                    });
                                })
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                    })
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            } else {
                return RNFetchBlob.fetch('GET', image.image_url)
                    .then((response) => {
                        response.respInfo.status === 200 &&
                            EThree.authDecrypt({ value: response.data, encoding: 'base64' })
                                .then((result) => {
                                    resolve({
                                        ...image,
                                        image_url: `data:${image?.mime || 'image/jpeg'};base64,${Buffer.from(result).toString(
                                            'base64',
                                        )}`,
                                    });
                                })
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                    })
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            }
        });
    };

    decryptGroupImage = (EThree, image, messageSenderCard) => {
        return new Promise((resolve, reject) => {
            if (!EThree || !image || !messageSenderCard) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return RNFetchBlob.fetch('GET', image.image_url)
                .then((response) => {
                    response.respInfo.status === 200 &&
                        EThree.decrypt({ value: response.data, encoding: 'base64' }, messageSenderCard)
                            .then((result) => {
                                resolve({
                                    ...image,
                                    image_url: `data:${image?.mime || 'image/jpeg'};base64,${Buffer.from(result).toString(
                                        'base64',
                                    )}`,
                                });
                            })
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

    deleteImage = (image) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!image || !image?.roomID || !image?.messageID || !image?.path) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(image.roomID)
                .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                .doc(image.messageID)
                .collection(DATABASE_CONSTANTS.CHAT_IMAGE)
                .doc(image.id)
                .delete()
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    editMessage = (roomID, messageID, editedMessage) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }
            if (!roomID || !messageID || !editedMessage) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            CHAT_ROOM_REF.doc(roomID)
                .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                .doc(messageID)
                .update({
                    message: editedMessage,
                    edited_at: firestore.FieldValue.serverTimestamp(),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    sharePostWithFriend = (friend, post, user) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!friend || !friend.uid || !post.id || !post.type) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return FirebaseChat.getDirectMessageChatRoomByUserID(friend.uid).then((room) => {
                if (room) {
                    this.sharePost({ id: room.id, ...room.data() }, post, user)
                        .then(resolve)
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                } else {
                    const roomData = {
                        owner: auth().currentUser.uid,
                        type: 'direct_message',
                        members: [auth().currentUser.uid, friend.uid],
                        admin_approval: false,
                    };
                    FirebaseChat.createChatRoom(roomData).then((newRoom) => {
                        this.sharePost({ id: newRoom.id, members: [auth().currentUser.uid, friend.uid] }, post, user)
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    });
                }
            });
        });
    };

    sharePost = (room, post, user) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!room || !room.id || !Array.isArray(room.members) || !post.id || !post.type || !user) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(room.id)
                .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                .add({
                    type: 'share_post',
                    postID: post.id,
                    postType: post.type,
                    user: {
                        uid: user.uid,
                        [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
                        [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                        [USER_CONSTANTS.AVATAR_URL]: user[USER_CONSTANTS.AVATAR_URL],
                    },
                    hide: [],
                    likes: [],
                    number_of_images: 0,
                    created_at: firestore.FieldValue.serverTimestamp(),
                    unread: room.members.filter((id) => id !== auth().currentUser.uid),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    shareItemWithFriend = (friend, item, user) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!friend || !friend.uid || !item.asin) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return FirebaseChat.getDirectMessageChatRoomByUserID(friend.uid).then((room) => {
                if (room) {
                    this.shareItem({ id: room.id, ...room.data() }, item, user)
                        .then(resolve)
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                } else {
                    const roomData = {
                        owner: auth().currentUser.uid,
                        type: 'direct_message',
                        members: [auth().currentUser.uid, friend.uid],
                        admin_approval: false,
                    };
                    FirebaseChat.createChatRoom(roomData).then((newRoom) => {
                        this.shareItem({ id: newRoom.id, members: [auth().currentUser.uid, friend.uid] }, item, user)
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    });
                }
            });
        });
    };

    shareItem = (room, item, user) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!room || !room.id || !Array.isArray(room.members) || !item.asin || !user) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(room.id)
                .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                .add({
                    type: 'share_item',
                    product: item,
                    user: {
                        uid: user.uid,
                        [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
                        [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                        [USER_CONSTANTS.AVATAR_URL]: user[USER_CONSTANTS.AVATAR_URL],
                    },
                    hide: [],
                    likes: [],
                    number_of_images: 0,
                    created_at: firestore.FieldValue.serverTimestamp(),
                    unread: room.members.filter((id) => id !== auth().currentUser.uid),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    createPoll = (room, data, options) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!room || !room.id || typeof data !== 'object' || !Array.isArray(options)) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(room.id)
                .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                .add({
                    ...data,
                    type: 'poll',
                    created_at: firestore.FieldValue.serverTimestamp(),
                    unread: room.members.filter((id) => id !== auth().currentUser.uid),
                    hide: [],
                    likes: [],
                    voted: [],
                    ended: false,
                    ended_at: null,
                })
                .then((messageRef) => {
                    return Promise.all(
                        options.map((option) =>
                            messageRef.collection(DATABASE_CONSTANTS.CHAT_POLL_OPTION).add({
                                roomId: room.id,
                                pollId: messageRef.id,
                                index: option.index,
                                answer: option.answer,
                                votes: [],
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

    voteInPoll = (roomID, messageID, optionID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID || !messageID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            if (optionID) {
                return CHAT_ROOM_REF.doc(roomID)
                    .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                    .doc(messageID)
                    .collection(DATABASE_CONSTANTS.CHAT_POLL_OPTION)
                    .doc(optionID)
                    .get()
                    .then((optionSnapshot) => {
                        if (!optionSnapshot.exists) {
                            resolve();
                            return;
                        } else {
                            const notVotedYet =
                                !Array.isArray(optionSnapshot.data().votes) ||
                                optionSnapshot.data().votes?.indexOf(auth().currentUser.uid) === -1;
                            return Promise.all([
                                CHAT_ROOM_REF.doc(roomID)
                                    .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                                    .doc(messageID)
                                    .update({
                                        voted: notVotedYet
                                            ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                                            : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                                        totalVotes: firestore.FieldValue.increment(notVotedYet ? 1 : -1),
                                    }),
                                optionSnapshot.ref.update({
                                    votes: notVotedYet
                                        ? firestore.FieldValue.arrayUnion(auth().currentUser.uid)
                                        : firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                                }),
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
            } else {
                // retract vote
                const removeUserVoteFromPollOptionPromise = new Promise((resolve, reject) => {
                    return CHAT_ROOM_REF.doc(roomID)
                        .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                        .doc(messageID)
                        .collection(DATABASE_CONSTANTS.CHAT_POLL_OPTION)
                        .where('votes', 'array-contains', auth().currentUser.uid)
                        .get()
                        .then((querySnapshot) => {
                            if (querySnapshot.empty) {
                                resolve();
                                return;
                            } else {
                                return Promise.all(
                                    querySnapshot.docs.map((option) =>
                                        option.ref.update({ votes: firestore.FieldValue.arrayRemove(auth().currentUser.uid) }),
                                    ),
                                )
                                    .then(resolve)
                                    .catch((error) => {
                                        reject(error);
                                        return;
                                    });
                            }
                        });
                });
                return Promise.all([
                    CHAT_ROOM_REF.doc(roomID)
                        .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                        .doc(messageID)
                        .update({
                            voted: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                            totalVotes: firestore.FieldValue.increment(-1),
                        }),
                    removeUserVoteFromPollOptionPromise,
                ])
                    .then(resolve)
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            }
        });
    };

    endPoll = (roomID, messageID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!roomID || !messageID) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return CHAT_ROOM_REF.doc(roomID)
                .collection(DATABASE_CONSTANTS.CHAT_MESSAGE)
                .doc(messageID)
                .get()
                .then((documentSnapshot) => {
                    if (!documentSnapshot.exists || documentSnapshot.data().user.uid !== auth().currentUser.uid) {
                        resolve();
                        return;
                    } else {
                        return documentSnapshot.ref
                            .update({
                                ended: true,
                                ended_at: firestore.FieldValue.serverTimestamp(),
                            })
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
}

export default new ChatMessage();
