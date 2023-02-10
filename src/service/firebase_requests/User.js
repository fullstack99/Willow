import firebase from '@react-native-firebase/app';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import { MISSING_FILENAME, UNAVAILABLE_USERNAME } from '../firebase_errors/constants';
import { childrenListSort, discardAlert, actionAlert, getRandomInt } from '../../utility';
import EThreeService from '../virgil_security';
import FirebaseAnalytics from '../firebase_analytics';
import FirebaseErrors from '../firebase_errors';
import * as FirebaseErrorsConstants from '../firebase_errors/constants';
import * as USER_CONSTANTS from '../../constants/User';
import * as DATABASE_CONSTANTS from '../../constants/Database';

const USER_REF = firestore().collection(DATABASE_CONSTANTS.USER);
const NOTIFICATION_REF = firestore().collection(DATABASE_CONSTANTS.NOTIFICATION);

class User {
    updateUserSessionCount = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                resolve();
                return;
            }

            return USER_REF.doc(auth().currentUser.uid)
                .update({
                    [USER_CONSTANTS.SESSION_COUNT]: firestore.FieldValue.increment(1),
                    [USER_CONSTANTS.BADGE]: 0,
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    checkUserStatusReminder = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            return USER_REF.doc(auth().currentUser.uid)
                .get()
                .then((userSnapshot) => {
                    if (!userSnapshot.exists) {
                        reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                        return;
                    } else if (
                        userSnapshot.data()[USER_CONSTANTS.SESSION_COUNT] === 3 &&
                        userSnapshot.data()[USER_CONSTANTS.STATUS].length === 0
                    ) {
                        resolve(true);
                    } else {
                        resolve(false);
                    }
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    resetUserBadge = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                resolve();
                return;
            }

            return USER_REF.doc(auth().currentUser.uid)
                .update({
                    [USER_CONSTANTS.BADGE]: 0,
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    uploadUserAvatar = async (avatar) => {
        try {
            if (avatar) {
                const filename = avatar.split('/').pop();
                if (!filename) throw { code: MISSING_FILENAME };
                const storagePath = `${DATABASE_CONSTANTS.USER_PROFILE_PIC}/${filename}`;
                await storage().ref(storagePath).putFile(`file://${avatar}`);
                const avatar_url = await storage().ref(storagePath).getDownloadURL();
                return { avatar_url, filename };
            } else {
                const filename = null;
                const randomInt = getRandomInt(1, 5);
                const STORAGE_BUCKET = firebase.app().options.storageBucket;
                const avatar_url = `https://firebasestorage.googleapis.com/v0/b/${STORAGE_BUCKET}/o/${
                    DATABASE_CONSTANTS.USER_PROFILE_PIC
                }%2Fdefault_avatar_${randomInt.toString()}.png?alt=media`;
                return { avatar_url, filename };
            }
        } catch (error) {
            throw error;
        }
    };

    updateUser = (data) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .update(data)
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    setUserById = (id, user) => {
        return new Promise((resolve, reject) => {
            USER_REF.doc(id)
                .set(user)
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getUserById = (id) => {
        return new Promise((resolve, reject) => {
            if (!id) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(id)
                .get()
                .then((userSnapshot) => resolve({ uid: userSnapshot.id, ...userSnapshot.data() }))
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    retrieveUserById = (id, next, setError) => {
        const unsubscribe = USER_REF.doc(id).onSnapshot({ next, error: (error) => FirebaseErrors.setError(error, setError) });
        return unsubscribe;
    };

    retrieveUsersFollowing = (userID, next, setError) => {
        return USER_REF.doc(userID)
            .collection(DATABASE_CONSTANTS.FOLLOWINGS)
            .onSnapshot({ next, error: (error) => FirebaseErrors.setError(error, setError) });
    };

    retrieveUsersFollowers = (userID, next, setError) => {
        return firestore()
            .collectionGroup(DATABASE_CONSTANTS.FOLLOWINGS)
            .where('uid', '==', userID)
            .onSnapshot({
                next,
                error: (error) => FirebaseErrors.setError(error, setError),
            });
    };

    getAllUsers = () => {
        return new Promise((resolve, reject) => {
            USER_REF.where('role', '==', 'user')
                .orderBy('name', 'asc')
                .get()
                .then((users) =>
                    resolve(
                        users.docs.map((user) => {
                            return { uid: user.id, ...user.data() };
                        }),
                    ),
                )
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getUsersByName = (search_term, page) => {
        return new Promise((resolve, reject) => {
            if (!search_term || typeof page !== 'number') {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            axios
                .get(`/api/user/search`, {
                    params: {
                        search_term,
                        page,
                    },
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getUserByNameAndFilter = (search_term, page, filter) => {
        return new Promise((resolve, reject) => {
            if (!search_term || typeof page !== 'number') {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            axios
                .get(`/api/user/search`, {
                    params: {
                        search_term,
                        page,
                        filter,
                    },
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    deleteAccount = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                resolve();
                return;
            }
            Promise.all([USER_REF.doc(auth().currentUser.uid).delete(), EThreeService.unregister()])
                .then(() => {
                    auth().signOut().then(resolve).catch(resolve);
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    checkIfPhoneNumberIsRegistered = (phoneNumber) => {
        return new Promise((resolve, reject) => {
            USER_REF.where(USER_CONSTANTS.PHONE_NUMBER, '==', phoneNumber)
                .get()
                .then((phoneNumberSnapshots) => {
                    resolve(phoneNumberSnapshots.size > 0);
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    checkIfUsernameIsRegistered = (username) => {
        return new Promise((resolve, reject) => {
            USER_REF.where(USER_CONSTANTS.USERNAME, '==', username)
                .get()
                .then((usernameSnapshots) => {
                    usernameSnapshots.size > 0 ? reject({ code: UNAVAILABLE_USERNAME }) : resolve(true);
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    checkFeedbackPrompted = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            return USER_REF.doc(auth().currentUser.uid)
                .get()
                .then((user) => {
                    if (!user.exists) {
                        reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                        return;
                    } else if (user.data()?.promptedFeedback) {
                        resolve(false);
                    } else {
                        user.ref
                            .update({ promptedFeedback: true })
                            .then(() => resolve(true))
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

    retrieveFollowers = (userID, next, error) => {
        return firestore()
            .collectionGroup(DATABASE_CONSTANTS.FOLLOWINGS)
            .where('pending', '==', false)
            .where('uid', '==', userID)
            .onSnapshot({ next, error });
    };

    retrieveFollowing = (userID, next, error) => {
        return USER_REF.doc(userID)
            .collection(DATABASE_CONSTANTS.FOLLOWINGS)
            .where('pending', '==', false)
            .onSnapshot({ next, error });
    };

    getListOfFollowers = (userID) => {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            firestore()
                .collectionGroup(DATABASE_CONSTANTS.FOLLOWINGS)
                .where('pending', '==', false)
                .where('uid', '==', userID)
                .get()
                .then((querySnapshot) => {
                    const data = [];
                    const usersPromises = [];
                    querySnapshot.forEach((followerDocRef) => {
                        usersPromises.push(
                            followerDocRef.ref.parent.parent
                                .get()
                                .then((userDocRef) => {
                                    data.push({ uid: userDocRef.id, ...userDocRef.data() });
                                })
                                .catch((error) => {
                                    reject(error);
                                    return;
                                }),
                        );
                    });
                    Promise.all(usersPromises)
                        .then((res) => {
                            resolve(data);
                        })
                        .catch((err) => {
                            console.log(err);
                            reject({ code: FirebaseErrorsConstants.DATABASE_ERROR });
                            return;
                        });
                });
        });
    };

    getListOfFollowings = (userID) => {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(userID)
                .collection(DATABASE_CONSTANTS.FOLLOWINGS)
                .where('pending', '==', false)
                .get()
                .then((querySnapshot) => {
                    const data = [];
                    const usersPromises = [];
                    querySnapshot.forEach((followingDoc) => {
                        usersPromises.push(
                            USER_REF.doc(followingDoc.data().uid)
                                .get()
                                .then((userDocRef) => {
                                    data.push({ uid: userDocRef.id, ...userDocRef.data() });
                                })
                                .catch((error) => {
                                    reject(error);
                                    return;
                                }),
                        );
                    });
                    Promise.all(usersPromises)
                        .then((res) => {
                            resolve(data);
                        })
                        .catch((err) => {
                            console.log(err);
                            reject({ code: FirebaseErrorsConstants.DATABASE_ERROR });
                            return;
                        });
                });
        });
    };

    retrieveListOfChildren = (observer, userID) => {
        if (!auth().currentUser && !userID) return;
        return USER_REF.doc(userID || auth().currentUser.uid)
            .collection(DATABASE_CONSTANTS.CHILDREN)
            .onSnapshot(observer);
    };

    retrieveListOfBlocked = (next, userID, setError) => {
        const unsubscribe = USER_REF.doc(userID)
            .collection(DATABASE_CONSTANTS.BLOCKED)
            .onSnapshot({
                next,
                error: (error) => FirebaseErrors.setError(error, setError),
            });
        return unsubscribe;
    };

    createChild = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.CHILDREN)
                .add({
                    birthday: null,
                    gender: null,
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    updateChildById = (childID, data) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject('authentication error');
                return;
            }

            if (!childID) {
                reject('missing childID');
                return;
            }

            if (data.birthday === undefined || data.gender === undefined) {
                reject('data format is incorrect');
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.CHILDREN)
                .doc(childID)
                .update(data)
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    deleteChildById = (childID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (!childID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.CHILDREN)
                .doc(childID)
                .delete()
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    blockUserById = (userID) => {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            discardAlert(
                () => {
                    USER_REF.doc(auth().currentUser.uid)
                        .collection(DATABASE_CONSTANTS.BLOCKED)
                        .add({
                            uid: userID,
                            created_at: firestore.FieldValue.serverTimestamp(),
                        })
                        .then(resolve)
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                },
                'Block User',
                'Are you sure you want to block this user?',
                'Block',
                'Cancel',
            );
        });
    };

    unblockUserById = (userID) => {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            actionAlert(
                () => {
                    USER_REF.doc(auth().currentUser.uid)
                        .collection(DATABASE_CONSTANTS.BLOCKED)
                        .where('uid', '==', userID)
                        .get()
                        .then((querySnapshot) => {
                            if (querySnapshot.size === 1) {
                                querySnapshot.docs[0].ref
                                    .delete()
                                    .then(resolve)
                                    .catch((error) => {
                                        reject(error);
                                        return;
                                    });
                            } else {
                                reject({ code: FirebaseErrorsConstants.DATABASE_ERROR });
                                return;
                            }
                        })
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                },
                'Unblock User',
                'Are you sure you want to unblock this user?',
                'Unblock',
            );
        });
    };

    retrieveFollowingStatus = (userID, next, error) => {
        return USER_REF.doc(auth().currentUser.uid)
            .collection(DATABASE_CONSTANTS.FOLLOWINGS)
            .where('uid', '==', userID)
            .onSnapshot({ next, error });
    };

    requestToFollowUserById = (userID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (!userID || userID === auth().currentUser.uid) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.FOLLOWINGS)
                .add({
                    uid: userID,
                    created_at: firestore.FieldValue.serverTimestamp(),
                    mutualFriend: false,
                    pending: true,
                })
                .then(() => FirebaseAnalytics.logFollowing(userID).then(resolve).catch(resolve))
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    acceptFriendRequest = (notification) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (
                !notification ||
                !notification.ref ||
                !notification.uid ||
                notification.type !== DATABASE_CONSTANTS.FRIEND_REQUEST
            ) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(notification.uid)
                .collection(DATABASE_CONSTANTS.FOLLOWINGS)
                .where('uid', '==', auth().currentUser.uid)
                .where('pending', '==', true)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        firestore()
                            .doc(notification.ref)
                            .update({ read: true, pending: false, read_at: firestore.FieldValue.serverTimestamp() })
                            .then(resolve)
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                                return;
                            });
                    } else if (querySnapshot.size === 1) {
                        querySnapshot.docs[0].ref
                            .update({
                                pending: false,
                            })
                            .then(resolve)
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                                return;
                            });
                        firestore()
                            .doc(notification.ref)
                            .update({ read: true, pending: false, read_at: firestore.FieldValue.serverTimestamp() })
                            .then(resolve)
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                                return;
                            });
                    } else {
                        console.log(error);
                        reject({ code: FirebaseErrorsConstants.DATABASE_ERROR });
                        return;
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    declineFriendRequest = (notification) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (
                !notification ||
                !notification.ref ||
                !notification.uid ||
                notification.type !== DATABASE_CONSTANTS.FRIEND_REQUEST
            ) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(notification.uid)
                .collection(DATABASE_CONSTANTS.FOLLOWINGS)
                .where('uid', '==', auth().currentUser.uid)
                .where('pending', '==', true)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        firestore()
                            .doc(notification.ref)
                            .update({
                                read: true,
                                pending: false,
                                decline: true,
                                read_at: firestore.FieldValue.serverTimestamp(),
                            })
                            .then(resolve)
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                                return;
                            });
                    } else {
                        const deleteFollowingPromises = [
                            firestore().doc(notification.ref).update({
                                read: true,
                                pending: false,
                                decline: true,
                                read_at: firestore.FieldValue.serverTimestamp(),
                            }),
                        ];
                        querySnapshot.docs.forEach((doc) => {
                            deleteFollowingPromises.push(doc.ref.delete());
                        });
                        Promise.all(deleteFollowingPromises)
                            .then(resolve)
                            .catch((error) => {
                                console.log(error);
                                reject(error);
                                return;
                            });
                    }
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    followUserById = (userID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (!userID || userID === auth().currentUser.uid) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            Promise.all([
                USER_REF.doc(userID).get(),
                USER_REF.doc(userID).collection(DATABASE_CONSTANTS.FOLLOWINGS).where('uid', '==', auth().currentUser.uid).get(),
            ]).then((res) => {
                if (!res[0].exists) resolve();
                const isAdmin = res[0].data().role === 'admin';
                const mutualFriend = !res[1].empty && res[1].size === 1 && !res[1].docs[0].data().pending;
                USER_REF.doc(auth().currentUser.uid)
                    .collection(DATABASE_CONSTANTS.FOLLOWINGS)
                    .add({
                        uid: userID,
                        created_at: firestore.FieldValue.serverTimestamp(),
                        mutualFriend,
                        pending: false,
                        isAdmin,
                    })
                    .then(() => FirebaseAnalytics.logFollowing(userID).then(resolve).catch(resolve))
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            });
        });
    };

    unfollowUserById = (userID) => {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            discardAlert(
                () => {
                    USER_REF.doc(auth().currentUser.uid)
                        .collection(DATABASE_CONSTANTS.FOLLOWINGS)
                        .where('uid', '==', userID)
                        .get()
                        .then((querySnapshot) => {
                            if (querySnapshot.size === 1) {
                                querySnapshot.docs[0].ref
                                    .delete()
                                    .then(resolve)
                                    .catch((error) => {
                                        reject(error);
                                        return;
                                    });
                            } else {
                                reject({ code: FirebaseErrorsConstants.DATABASE_ERROR });
                            }
                        })
                        .catch((error) => {
                            reject(FirebaseErrors.checkError(error));
                            return;
                        });
                },
                'Unfollow',
                'Are you sure you want to unfollow this user?',
                'Unfollow',
                'Cancel',
            );
        });
    };

    quickFriendFollow = (userID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                resolve();
                return;
            }
            if (!userID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            return Promise.all([USER_REF.doc(auth().currentUser.uid).get(), USER_REF.doc(userID).get()]).then((users) => {
                if (!users[0].exists || !users[1].exists) {
                    resolve();
                    return;
                }

                const isAdmin = users[1].data()[USER_CONSTANTS.ROLE] === 'admin';

                return USER_REF.doc(auth().currentUser.uid)
                    .collection(DATABASE_CONSTANTS.FOLLOWINGS)
                    .add({
                        uid: userID,
                        created_at: firestore.FieldValue.serverTimestamp(),
                        mutualFriend: true,
                        pending: false,
                        isAdmin,
                        QRCodeScanned: true,
                    })
                    .then(() => FirebaseAnalytics.logFollowing(userID).then(resolve).catch(resolve))
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            });
        });
    };

    muteUserByID = (userID) => {
        return new Promise((resolve, reject) => {
            if (!userID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            const query = USER_REF.doc(auth().currentUser.uid).collection(DATABASE_CONSTANTS.MUTED);
            query
                .where('uid', '==', userID)
                .get()
                .then((mutedSnapshots) => {
                    if (mutedSnapshots.empty) {
                        query
                            .add({
                                uid: userID,
                                created_at: firestore.FieldValue.serverTimestamp(),
                            })
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    } else {
                        Promise.all(mutedSnapshots.docs.map((doc) => doc.ref.delete()))
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    }
                });
        });
    };

    retrieveUsersBookmarks = (type, next, error) => {
        if (!type) {
            return;
        }

        if (type === 'all') {
            return firestore()
                .collectionGroup(DATABASE_CONSTANTS.BOOKMARK)
                .where('uid', '==', auth().currentUser.uid)
                .onSnapshot({ next, error });
        } else {
            return firestore()
                .collectionGroup(DATABASE_CONSTANTS.BOOKMARK)
                .where('type', '==', type)
                .where('uid', '==', auth().currentUser.uid)
                .onSnapshot({ next, error });
        }
    };

    bookmarkItem = (asin, userID) => {
        return new Promise((resolve, reject) => {
            if (!asin) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            (userID || auth().currentUser.uid) &&
                USER_REF.doc(userID || auth().currentUser.uid)
                    .update({
                        bookmark_items: firestore.FieldValue.arrayUnion(asin),
                    })
                    .then(() => resolve(`Bookmark item ${asin} successfully...`))
                    .catch((error) => {
                        reject(error);
                        return;
                    });
        });
    };

    unbookmarkItem = (asin, userID) => {
        return new Promise((resolve, reject) => {
            if (!asin) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            (userID || auth().currentUser.uid) &&
                USER_REF.doc(userID || auth().currentUser.uid)
                    .update({
                        bookmark_items: firestore.FieldValue.arrayRemove(asin),
                    })
                    .then(() => resolve(`Unbookmark item ${asin} successfully...`))
                    .catch((error) => {
                        reject(error);
                        return;
                    });
        });
    };

    createRecent = (userID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (!userID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.RECENTS)
                .where('uid', '==', userID)
                .get()
                .then((querySnapshot) => {
                    if (querySnapshot.empty) {
                        USER_REF.doc(auth().currentUser.uid)
                            .collection(DATABASE_CONSTANTS.RECENTS)
                            .add({
                                uid: userID,
                                created_at: firestore.FieldValue.serverTimestamp(),
                                last_view: firestore.FieldValue.serverTimestamp(),
                            })
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    } else if (querySnapshot.size === 1) {
                        querySnapshot.docs[0].ref
                            .update({
                                last_view: firestore.FieldValue.serverTimestamp(),
                            })
                            .then(resolve)
                            .catch((error) => {
                                reject(error);
                                return;
                            });
                    } else {
                        // not supposed to happen. delete recents instead
                        const recentsDeletePromises = [];
                        querySnapshot.forEach((r) => recentsDeletePromises.push(r.ref.delete()));
                        Promise.all(recentsDeletePromises)
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

    deleteRecent = (recentID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (!recentID) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.VIEWERS)
                .doc(recentID)
                .delete()
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getMyListOfItems = () => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (!asin) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }
            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.ITEMS)
                .get()
                .then((querySnapshot) => {
                    resolve(
                        querySnapshot.docs.map((i) => {
                            return { id: i.id, ...i.data() };
                        }),
                    );
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    checkIfItemIsAdded = (asin) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                resolve(null);
                return;
            }

            if (!asin) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }
            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.ITEMS)
                .doc(asin)
                .get()
                .then((itemSnapshot) => {
                    resolve(itemSnapshot.exists);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    addItem = (item) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (!item || !item.asin) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.ITEMS)
                .doc(item.asin)
                .set({ product: item, created_at: firestore.FieldValue.serverTimestamp() })
                .then(resolve)
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    removeItem = (asin) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: FirebaseErrorsConstants.NOT_AUTHENTICATED });
                return;
            }

            if (!asin) {
                reject({ code: FirebaseErrorsConstants.INVALID_ARGUMENTS });
                return;
            }

            USER_REF.doc(auth().currentUser.uid)
                .collection(DATABASE_CONSTANTS.ITEMS)
                .doc(asin)
                .delete()
                .then(resolve)
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };
}

export default new User();
