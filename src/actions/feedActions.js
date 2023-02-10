import firestore from '@react-native-firebase/firestore';
import * as DATABASE_CONSTANTS from '../constants/Database';

const FEED = 'feed';

export const SET_LOADING = `${FEED}/SET_LOADING`;
export const INIT_FETCH = `${FEED}/INIT_FETCH`;
export const LOAD_MORE = `${FEED}/LOAD_MORE`;
export const FETCH_MORE = `${FEED}/FETCH_MORE`;
export const ADD_POST = `${FEED}/ADD_POST`;
export const UPDATE_POST = `${FEED}/UPDATE_POST`;
export const DELETE_POST = `${FEED}/DELETE_POST`;
export const SELECT_TYPE = `${FEED}/SELECT_TYPE`;

export const initFeed = (type) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: SET_LOADING,
                loading: true,
            });
            const currentUserID = getState().auth.user.uid;
            const pageLimit = 20;
            // const listOfFollowings =
            //     (await Promise.all([
            //         ...getState().auth.user.followings.map(async (f) => {
            //             if (f.pending) return;
            //             const snapshot = await firestore().collection(DATABASE_CONSTANTS.USER).doc(f.uid).get();
            //             return snapshot.ref;
            //         }),
            //         (await firestore().collection(DATABASE_CONSTANTS.USER).doc(getState().auth.user.uid).get()).ref,
            //     ])) || [];
            const listOfFollowings = [
                ...getState()
                    .auth.following.filter((f) => !f.pending)
                    .map((f) => f.uid),
                currentUserID,
            ];

            if (listOfFollowings.length > 0) {
                const querySnapshot = type
                    ? await firestore()
                          .collection(DATABASE_CONSTANTS.FEED)
                          .where('show', 'array-contains', currentUserID)
                          .where('type', '==', type)
                          .where('anonymous', '==', false)
                          .orderBy('created_at', 'desc')
                          .limit(pageLimit)
                          .get()
                    : await firestore()
                          .collection(DATABASE_CONSTANTS.FEED)
                          .where('show', 'array-contains', currentUserID)
                          .where('anonymous', '==', false)
                          .orderBy('created_at', 'desc')
                          .limit(pageLimit)
                          .get();

                if (querySnapshot.empty) {
                    dispatch({
                        type: INIT_FETCH,
                        items: [],
                        endReached: true,
                    });
                } else {
                    const endDocument = querySnapshot.docs[querySnapshot.size - 1];
                    dispatch({
                        type: INIT_FETCH,
                        items: querySnapshot.docs
                            .map((doc) => {
                                return { id: doc.id, ...doc.data() };
                            })
                            .filter((doc) => (Array.isArray(doc?.flagged) ? doc.flagged.indexOf(currentUserID) === -1 : true)),
                        endReached: querySnapshot.size !== pageLimit,
                        endDocument,
                    });
                }
            } else {
                dispatch({
                    type: INIT_FETCH,
                    items: [],
                    endReached: true,
                });
            }
        } catch (error) {
            console.log(error);
            dispatch({
                type: INIT_FETCH,
                items: [],
                endReached: true,
            });
            throw error;
        }
    };
};

export const getMoreFeed = (type) => {
    return async (dispatch, getState) => {
        try {
            dispatch({
                type: SET_LOADING,
                loading: true,
            });

            const pageLimit = 20;
            const currentUserID = getState().auth.user.uid;
            // const listOfFollowings =
            //     (await Promise.all([
            //         ...getState().auth.followings.map(async (f) => {
            //             const snapshot = await firestore().collection(DATABASE_CONSTANTS.USER).doc(f.uid).get();
            //             return snapshot.ref;
            //         }),
            //         (await firestore().collection(DATABASE_CONSTANTS.USER).doc(getState().auth.user.uid).get()).ref,
            //     ])) || [];
            const listOfFollowings = [
                ...getState()
                    .auth.following.filter((f) => !f.pending)
                    .map((f) => f.uid),
                currentUserID,
            ];

            if (listOfFollowings.length > 0) {
                const querySnapshot = type
                    ? await firestore()
                          .collection(DATABASE_CONSTANTS.FEED)
                          .where('type', '==', type)
                          .where('show', 'array-contains', currentUserID)
                          .orderBy('created_at', 'desc')
                          .startAfter(getState().feed.endDocument)
                          .limit(pageLimit)
                          .get()
                    : await firestore()
                          .collection(DATABASE_CONSTANTS.FEED)
                          .where('show', 'array-contains', currentUserID)
                          .orderBy('created_at', 'desc')
                          .startAfter(getState().feed.endDocument)
                          .limit(pageLimit)
                          .get();

                if (querySnapshot.empty) {
                    dispatch({
                        type: LOAD_MORE,
                        items: [],
                        endReached: true,
                    });
                } else {
                    const endDocument = querySnapshot.docs[querySnapshot.size - 1];
                    dispatch({
                        type: LOAD_MORE,
                        items: querySnapshot.docs
                            .map((doc) => {
                                return { id: doc.id, ...doc.data() };
                            })
                            .filter((doc) => (Array.isArray(doc?.flagged) ? doc.flagged.indexOf(currentUserID) === -1 : true)),
                        endReached: querySnapshot.size !== pageLimit,
                        endDocument,
                    });
                }
            } else {
                dispatch({
                    type: LOAD_MORE,
                    items: [],
                    endReached: true,
                });
            }
        } catch (error) {
            dispatch({
                type: SET_LOADING,
                loading: false,
            });
            throw error;
        }
    };
};

export const addPost = (post) => {
    return (dispatch, getState) => {
        try {
            const currentFeedType = getState().feed.selected;
            (currentFeedType === 'ALL' || post.type === currentFeedType) &&
                !post.anonymous &&
                dispatch({
                    type: ADD_POST,
                    post,
                });
        } catch (error) {
            throw error;
        }
    };
};

export const updatePost = (post) => {
    return (dispatch) => {
        try {
            dispatch({
                type: UPDATE_POST,
                post,
            });
        } catch (error) {
            throw error;
        }
    };
};

export const deletePost = (post) => {
    return (dispatch) => {
        try {
            dispatch({
                type: DELETE_POST,
                post,
            });
        } catch (error) {
            throw error;
        }
    };
};

export const selectType = (selected) => ({
    type: SELECT_TYPE,
    selected,
});
