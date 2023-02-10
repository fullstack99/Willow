import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import storage from '@react-native-firebase/storage';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as ERROR_CONSTANTS from '../../service/firebase_errors/constants';

const CHAT_REF = firestore().collection(DATABASE_CONSTANTS.CHAT_ROOM);

class PublicForumChat {
    createChat = (data, avatar) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }

            if (!data || !avatar) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return this.uploadChatRoomAvatar(avatar)
                .then(({ avatar_url, filename }) => {
                    return CHAT_REF.add({
                        ...data,
                        type: 'public_forum',
                        avatar_url,
                        imageFileName: filename,
                        members: [auth().currentUser.uid],
                        show: [auth().currentUser.uid],
                        pinned: [],
                        muted: [],
                        owner: auth().currentUser.uid,
                        admin: [auth().currentUser.uid],
                        latest_message: null,
                        created_at: firestore.FieldValue.serverTimestamp(),
                        updated_at: firestore.FieldValue.serverTimestamp(),
                    })
                        .then((roomRef) => {
                            roomRef
                                .get()
                                .then((roomSnapshot) => resolve({ id: roomSnapshot.id, ...roomSnapshot.data() }))
                                .catch((error) => {
                                    reject(error);
                                    return;
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

    uploadChatRoomAvatar = async (avatar) => {
        try {
            const filename = avatar.split('/').pop();
            if (!filename) throw { code: ERROR_CONSTANTS.MISSING_FILENAME };
            const storagePath = `${DATABASE_CONSTANTS.CHAT_ROOM_PIC}/${filename}`;
            await storage().ref(storagePath).putFile(`file://${avatar}`);
            const avatar_url = await storage().ref(storagePath).getDownloadURL();
            return { avatar_url, filename };
        } catch (error) {
            throw error;
        }
    };

    leaveChat = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!roomID) {
                reject({ code: ERROR_CON.INVALID_ARGUMENTS });
                return;
            }

            CHAT_REF.doc(roomID)
                .get()
                .then((roomSnapshot) => {
                    if (roomSnapshot.exists && roomSnapshot.data().owner !== auth().currentUser.uid) {
                        Promise.all([
                            roomSnapshot.ref.collection(DATABASE_CONSTANTS.CHAT_MEMBER).doc(auth().currentUser.uid).delete(),
                            roomSnapshot.ref.update({
                                admin: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                                members: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                                show: firestore.FieldValue.arrayRemove(auth().currentUser.uid),
                            }),
                        ])
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    } else {
                        resolve();
                    }
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getPublicFroumByID = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!roomID) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return CHAT_REF.doc(roomID)
                .get()
                .then((roomSnapshot) => {
                    resolve({ id: roomSnapshot.id, ...roomSnapshot.data() });
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getPublicForums = (next, error) => {
        if (!next || !error) return;
        return CHAT_REF.where('type', '==', 'public_forum').onSnapshot({ next, error });
    };

    joinForum = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!roomID) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return Promise.all([
                CHAT_REF.doc(roomID).collection(DATABASE_CONSTANTS.CHAT_MEMBER).doc(auth().currentUser.uid).set({
                    created_at: firestore.FieldValue.serverTimestamp(),
                    last_seen: firestore.FieldValue.serverTimestamp(),
                    isAdmin: false,
                }),
                CHAT_REF.doc(roomID).update({
                    members: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
                    show: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
                    updated_at: firestore.FieldValue.serverTimestamp(),
                }),
            ])
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    requestToJoinForum = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!roomID) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return CHAT_REF.doc(roomID)
                .collection(DATABASE_CONSTANTS.JOIN_REQUEST)
                .add({
                    user: auth().currentUser.uid,
                    created_at: firestore.FieldValue.serverTimestamp(),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    checkJoinRequestStatus = (roomID, next, error) => {
        if (!next || !error) return;
        return CHAT_REF.doc(roomID).collection(DATABASE_CONSTANTS.JOIN_REQUEST).onSnapshot({ next, error });
    };

    updateForumShow = (roomID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!roomID) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return CHAT_REF.doc(roomID)
                .update({
                    show: firestore.FieldValue.arrayUnion(auth().currentUser.uid),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    updateForumAvatar = (roomID, avatar) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!roomID || !avatar) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return CHAT_REF.doc(roomID)
                .get()
                .then((roomSnapshot) => {
                    if (roomSnapshot.exists) {
                        this.uploadChatRoomAvatar(avatar)
                            .then(({ avatar_url, filename }) => {
                                roomSnapshot.ref
                                    .update({
                                        avatar_url,
                                        imageFileName: filename,
                                        updated_at: firestore.FieldValue.serverTimestamp(),
                                    })
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
                    } else {
                        resolve();
                    }
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    updateForumName = (roomID, name) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!roomID || !name) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return CHAT_REF.doc(roomID)
                .update({
                    name,
                    updated_at: firestore.FieldValue.serverTimestamp(),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    updateForumAbout = (roomID, about) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: ERROR_CONSTANTS.NOT_AUTHENTICATED });
                return;
            }
            if (!roomID || !about) {
                reject({ code: ERROR_CONSTANTS.INVALID_ARGUMENTS });
                return;
            }

            return CHAT_REF.doc(roomID)
                .update({
                    about,
                    updated_at: firestore.FieldValue.serverTimestamp(),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };
}

export default new PublicForumChat();
