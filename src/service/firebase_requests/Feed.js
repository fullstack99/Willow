import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import storage from '@react-native-firebase/storage';
import axios from 'axios';
import * as constants from '../../constants/Database';
import { INVALID_ARGUMENTS, MISSING_FILENAME, NOT_AUTHENTICATED, USER_DISABLED } from '../../service/firebase_errors';

const FEED_REF = firestore().collection(constants.FEED);

class Feed {
    retrieveFeed = (feedID, next, error) => {
        return FEED_REF.doc(feedID).onSnapshot({
            next,
            error,
        });
    };

    getFeedByID = (feedID) => {
        return new Promise((resolve, reject) => {
            if (!feedID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            return FEED_REF.doc(feedID)
                .get()
                .then((feedSnapshot) => {
                    if (feedSnapshot.exists) {
                        resolve({ id: feedSnapshot.id, ...feedSnapshot.data() });
                    } else {
                        resolve(null);
                    }
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    retrieveFeedUpvote = (feedID, next, error) => {
        return FEED_REF.doc(feedID).collection(constants.UPVOTE).onSnapshot({
            next,
            error,
        });
    };

    retrieveFeedDownvote = (feedID, next, error) => {
        return FEED_REF.doc(feedID).collection(constants.DOWNVOTE).onSnapshot({
            next,
            error,
        });
    };

    retrieveFeedComments = (feedID, next, error) => {
        return FEED_REF.doc(feedID).collection(constants.COMMENTS).orderBy('created_at', 'desc').onSnapshot({
            next,
            error,
        });
    };

    retrieveFeedBookmarkStatus = (feedID, next, error) => {
        if (!auth().currentUser) return null;

        return FEED_REF.doc(feedID).collection(constants.BOOKMARK).where('uid', '==', auth().currentUser.uid).onSnapshot({
            next,
            error,
        });
    };

    getTipsByName = (search_term, page) => {
        return new Promise((resolve, reject) => {
            if (!search_term || typeof page !== 'number') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            axios
                .get(`/api/discover/tips`, {
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

    getPostsByTypeAndUserID = (userID, type) => {
        return new Promise((resolve, reject) => {
            if (!userID || !type) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            firestore()
                .collection(constants.FEED)
                .where('type', '==', type)
                .where('author', '==', userID)
                .orderBy('created_at', 'desc')
                .get()
                .then((querySnapshot) => {
                    resolve(
                        querySnapshot.docs.map((t) => {
                            return { id: t.id, ...t.data() };
                        }),
                    );
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getReviewsByName = () => {};

    getQuestionsByName = (search_term, page) => {
        return new Promise((resolve, reject) => {
            if (!search_term || typeof page !== 'number') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            axios
                .get(`/api/discover/questions`, {
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

    getFeedsTopComment = (feedID) => {
        return new Promise((resolve, reject) => {
            if (!feedID || typeof feedID !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            FEED_REF.doc(feedID)
                .collection(constants.COMMENTS)
                .orderBy('number_of_replies', 'desc')
                .limit(1)
                .get()
                .then((commentsSnapshot) => {
                    const comments = [];
                    commentsSnapshot.forEach((c) => {
                        comments.push({ id: c.id, ...c.data() });
                    });
                    resolve(comments);
                })
                .catch((error) => {
                    console.log(error);
                    reject(error);
                    return;
                });
        });
    };

    getUpvotes = (feedID) => {
        return new Promise((resolve, reject) => {
            if (!feedID || typeof feedID !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            FEED_REF.doc(feedID)
                .collection(constants.UPVOTE)
                .get()
                .then((querySnapshot) => {
                    resolve(
                        querySnapshot.docs.map((uv) => {
                            return { id: uv.id, ...uv.data() };
                        }),
                    );
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    getDownvotes = (feedID) => {
        return new Promise((resolve, reject) => {
            if (!feedID || typeof feedID !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            FEED_REF.doc(feedID)
                .collection(constants.DOWNVOTE)
                .get()
                .then((querySnapshot) => {
                    resolve(
                        querySnapshot.docs.map((dv) => {
                            return { id: dv.id, ...dv.data() };
                        }),
                    );
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    createFeed = async (type, data, photo) => {
        try {
            switch (type) {
                case constants.TIPS:
                case constants.REVIEWS:
                case constants.QUESTIONS:
                    break;
                default:
                    throw { code: INVALID_ARGUMENTS };
            }

            if (typeof data !== 'object') {
                throw { code: INVALID_ARGUMENTS };
            }

            if (!auth().currentUser) {
                throw { code: NOT_AUTHENTICATED };
            }

            let imageFileName = null;
            let image_url = null;

            if (photo && typeof photo === 'string') {
                const image_data = await this.uploadFeedImage(type, photo);
                imageFileName = image_data.filename;
                image_url = image_data.image_url;
            }

            if (photo && Array.isArray(photo)) {
                const images_data = await Promise.all(photo.map((p) => this.uploadFeedImage(type, p)));
                imageFileName = images_data.map((d) => d.filename);
                image_url = images_data.map((d) => d.image_url);
            }

            const newPostReference = await firestore()
                .collection(constants.FEED)
                .add({
                    type,
                    anonymous: false,
                    ...data,
                    imageFileName,
                    image_url,
                    author: auth().currentUser.uid,
                    created_at: firestore.Timestamp.now(),
                    vote: 0,
                    number_of_comments: 0,
                    number_of_viewers: 0,
                    number_of_flagged: 0,
                    flagged: [],
                    show: [auth().currentUser.uid],
                });

            return {
                id: newPostReference.id,
                type,
                anonymous: false,
                ...data,
                imageFileName,
                image_url,
                author: auth().currentUser.uid,
                created_at: firestore.Timestamp.now(),
                vote: 0,
                number_of_comments: 0,
                number_of_viewers: 0,
                number_of_flagged: 0,
                flagged: [],
                show: [auth().currentUser.uid],
            };
        } catch (error) {
            throw error;
        }
    };
    updateFeed = async (data, photo) => {
        try {
            if (typeof data !== 'object' || typeof data.id !== 'string') {
                throw { code: INVALID_ARGUMENTS };
            }

            let imageFileName = data.imageFileName;
            let image_url = data.image_url;

            if (photo && typeof photo === 'string' && photo !== image_url) {
                const image_data = await this.uploadFeedImage(data.type, photo);
                imageFileName = image_data.filename;
                image_url = image_data.image_url;
            } else if (data.type === constants.QUESTIONS) {
                imageFileName = null;
                image_url = null;
            } else if (photo && Array.isArray(photo)) {
                if (photo.length === 0) {
                    imageFileName = null;
                    image_url = null;
                } else {
                    imageFileName = photo
                        .filter((p) => p.startsWith('https://'))
                        .map((p) => p.substring(p.lastIndexOf('%') + 1, p.lastIndexOf('?')));
                    const images_data = await Promise.all(
                        photo.filter((p) => !p.startsWith('https://')).map((p) => this.uploadFeedImage(data.type, p)),
                    );
                    imageFileName = [...imageFileName, ...images_data.map((d) => typeof d.filename === 'string' && d.filename)];
                    image_url = [
                        ...photo.filter((p) => p.startsWith('https://')),
                        ...images_data.map((d) => typeof d.image_url === 'string' && d.image_url),
                    ];
                }
            }

            const authorDocument = await firestore().collection(constants.USER).doc(auth().currentUser.uid).get();
            if (!authorDocument.exists) {
                throw { code: NOT_AUTHENTICATED };
            }

            const { id, ...otherDatas } = data;

            await firestore()
                .collection(constants.FEED)
                .doc(id)
                .update({
                    ...otherDatas,
                    imageFileName,
                    image_url,
                    edited_at: firestore.FieldValue.serverTimestamp(),
                });

            return {
                ...data,
                imageFileName,
                image_url,
                edited_at: firestore.FieldValue.serverTimestamp(),
            };
        } catch (error) {
            throw error;
        }
    };

    deleteFeed = (data) => {
        return new Promise((resolve, reject) => {
            if (typeof data !== 'object' || typeof data.id !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            firestore()
                .collection(constants.FEED)
                .doc(data.id)
                .delete()
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    reportFeed = (data) => {
        return new Promise((resolve, reject) => {
            if (typeof data !== 'object' || typeof data.id !== 'string' || typeof data.author !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            firestore()
                .collection(constants.FEED)
                .doc(data.id)
                .collection(constants.FLAGGED)
                .add({
                    uid: auth().currentUser.uid,
                    author: data.author,
                    created_at: firestore.Timestamp.now(),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    uploadFeedImage = async (type, photo) => {
        try {
            const filename = photo.split('/').pop();
            if (!filename) throw { code: MISSING_FILENAME };
            const storagePath = `${type}/${filename}`;
            await storage().ref(storagePath).putFile(`file://${photo}`);
            const image_url = await storage().ref(storagePath).getDownloadURL();
            return { image_url, filename };
        } catch (error) {
            throw error;
        }
    };

    doubleTapUpvoteInFeed = (feedID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!feedID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            const upvotePromise = new Promise((resolve, reject) => {
                FEED_REF.doc(feedID)
                    .collection(constants.UPVOTE)
                    .where('uid', '==', auth().currentUser.uid)
                    .get()
                    .then((querySnapshot) => {
                        if (querySnapshot.empty) {
                            FEED_REF.doc(feedID)
                                .collection(constants.UPVOTE)
                                .add({
                                    uid: auth().currentUser.uid,
                                    created_at: firestore.FieldValue.serverTimestamp(),
                                })
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

            const removeDownvotePromise = new Promise((resolve, reject) => {
                FEED_REF.doc(feedID)
                    .collection(constants.DOWNVOTE)
                    .where('uid', '==', auth().currentUser.uid)
                    .get()
                    .then((querySnapshot) => {
                        const deleteDownvotePromise = [];
                        querySnapshot.docs.forEach((doc) => deleteDownvotePromise.push(doc.ref.delete()));
                        Promise.all(deleteDownvotePromise)
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

            Promise.all([upvotePromise, removeDownvotePromise])
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    upvoteInFeed = (feedID, upvoteID, downvoteID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            } else if (!feedID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            } else if (upvoteID) {
                FEED_REF.doc(feedID)
                    .collection(constants.UPVOTE)
                    .doc(upvoteID)
                    .delete()
                    .then(resolve)
                    .catch((error) => {
                        console.log(error);
                        reject(error);
                        return;
                    });
            } else {
                const removeDownvotePromise = downvoteID
                    ? FEED_REF.doc(feedID).collection(constants.DOWNVOTE).doc(downvoteID).delete()
                    : null;
                const upvotePromise = FEED_REF.doc(feedID).collection(constants.UPVOTE).add({
                    uid: auth().currentUser.uid,
                    created_at: firestore.FieldValue.serverTimestamp(),
                });

                Promise.all([removeDownvotePromise, upvotePromise])
                    .then(resolve)
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            }
        });
    };

    downvoteInFeed = (feedID, upvoteID, downvoteID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            } else if (!feedID) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            } else if (downvoteID) {
                FEED_REF.doc(feedID)
                    .collection(constants.DOWNVOTE)
                    .doc(downvoteID)
                    .delete()
                    .then(resolve)
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            } else {
                const removeUpvotePromise = upvoteID
                    ? FEED_REF.doc(feedID).collection(constants.UPVOTE).doc(upvoteID).delete()
                    : null;
                const donwvotePromise = FEED_REF.doc(feedID).collection(constants.DOWNVOTE).add({
                    uid: auth().currentUser.uid,
                    created_at: firestore.FieldValue.serverTimestamp(),
                });

                Promise.all([removeUpvotePromise, donwvotePromise])
                    .then(resolve)
                    .catch((error) => {
                        reject(error);
                        return;
                    });
            }
        });
    };

    bookmark = (data) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!data || typeof data.id !== 'string' || typeof data.type !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            firestore()
                .collection(constants.FEED)
                .doc(data.id)
                .collection(constants.BOOKMARK)
                .add({
                    uid: auth().currentUser.uid,
                    type: data.type,
                    created_at: firestore.Timestamp.now(),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    unbookmark = (feedID, bookmarkID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!feedID || typeof feedID !== 'string' || !bookmarkID || typeof bookmarkID !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            firestore()
                .collection(constants.FEED)
                .doc(feedID)
                .collection(constants.BOOKMARK)
                .doc(bookmarkID)
                .delete()
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    updatePostViewer = (feedID) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!feedID || typeof feedID !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            FEED_REF.doc(feedID)
                .get()
                .then((snapshot) => {
                    if (snapshot.exists) {
                        snapshot.ref
                            .collection(constants.VIEWERS)
                            .where('uid', '==', auth().currentUser.uid)
                            .get()
                            .then((querySnapshot) => {
                                if (querySnapshot.empty) {
                                    snapshot.ref
                                        .collection(constants.VIEWERS)
                                        .add({
                                            uid: auth().currentUser.uid,
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
                                        .update({ last_view: firestore.FieldValue.serverTimestamp() })
                                        .then(resolve)
                                        .catch((error) => {
                                            reject(error);
                                            return;
                                        });
                                } else {
                                    // not supposed to happen. clean up instead
                                    const viewersDeletePromises = [];
                                    querySnapshot.forEach((v) => viewersDeletePromises.push(v.ref.delete()));
                                    Promise.all(viewersDeletePromises)
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
                    } else resolve();
                })
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    // Comment
    createCommentInFeed = (feedID, comment, anonymous) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (!feedID || typeof feedID !== 'string' || !comment || typeof comment !== 'string') {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            FEED_REF.doc(feedID)
                .collection(constants.COMMENTS)
                .add({
                    author: auth().currentUser.uid,
                    comment,
                    anonymous: anonymous || false,
                    created_at: firestore.Timestamp.now(),
                    number_of_replies: 0,
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };

    // Reply
    createReplyInComment = (feedID, commentID, reply, anonymous) => {
        return new Promise((resolve, reject) => {
            if (!auth().currentUser) {
                reject({ code: NOT_AUTHENTICATED });
                return;
            }

            if (
                !feedID ||
                typeof feedID !== 'string' ||
                !commentID ||
                typeof commentID !== 'string' ||
                !reply ||
                typeof reply !== 'string'
            ) {
                reject({ code: INVALID_ARGUMENTS });
                return;
            }

            FEED_REF.doc(feedID)
                .collection(constants.COMMENTS)
                .doc(commentID)
                .collection(constants.REPLIES)
                .add({
                    author: auth().currentUser.uid,
                    reply,
                    anonymous: anonymous || false,
                    created_at: firestore.Timestamp.now(),
                })
                .then(resolve)
                .catch((error) => {
                    reject(error);
                    return;
                });
        });
    };
}

export default new Feed();
