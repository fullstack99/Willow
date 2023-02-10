import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import messaging from '@react-native-firebase/messaging';
import FirebaseAnalytics from '../service/firebase_analytics';
import EThreeService from '../service/virgil_security';
import * as DATABASE_CONSTANTS from '../constants/Database';
import * as USER_CONSTANTS from '../constants/User';

const AUTH = 'auth';
export const SKIP_ONBOARDIMG_SCREENS = `${AUTH}/SKIP_ONBOARDING_SCREENS`;
export const UPDATE_USER = `${AUTH}/UPDATE_USER`;
export const UPDATE_FOLLOWING = `${AUTH}/UPDATE_FOLLOWING`;
export const UPDATE_FOLLOWERS = `${AUTH}/UPDATE_FOLLOWERS`;
export const UPDATE_MUTED = `${AUTH}/UPDATE_MUTED`;
export const UPDATE_BLOCKED = `${AUTH}/UPDATE_BLOCKED`;
export const RESET_USER = `${AUTH}/RESET_USER`;
export const UPDATE_USER_ACCESSTOKEN = `${AUTH}/UPDATE_USER_ACCESSTOKEN`;
export const SIGNOUT = `${AUTH}/SIGNOUT`;

export const skipOnboarding = () => ({
    type: SKIP_ONBOARDIMG_SCREENS,
    payload: true,
});

export const updateUser = (user) => {
    return (dispatch) => {
        dispatch({
            type: UPDATE_USER,
            payload: user,
        });
    };
};

const updateFollowing = (following) => ({
    type: UPDATE_FOLLOWING,
    following,
});

const updateFollowers = (followers) => ({
    type: UPDATE_FOLLOWERS,
    followers,
});

const updateBlocked = (blocked) => ({
    type: UPDATE_BLOCKED,
    blocked,
});

const updateMuted = (muted) => ({
    type: UPDATE_MUTED,
    muted,
});

export const resetUser = () => ({
    type: RESET_USER,
});

export const updateUserAccessToken = (accessToken) => ({
    type: UPDATE_USER_ACCESSTOKEN,
    accessToken,
});

export const userSnapshot = () => {
    return (dispatch) => {
        if (!auth().currentUser) return;
        const unsubscribe = firestore()
            .collection(DATABASE_CONSTANTS.USER)
            .doc(auth().currentUser.uid)
            .onSnapshot({
                next: (userSnapshot) => {
                    if (userSnapshot.exists) {
                        const user = {
                            uid: userSnapshot.id,
                            ...userSnapshot.data(),
                        };
                        FirebaseAnalytics.configure(user).catch((error) => {
                            console.log('[Analytics Error]:', error);
                        });
                        dispatch(updateUser(user));
                    }
                },
                error: (error) => {
                    FirebaseAnalytics.logSignOut().then(() => {
                        auth()
                            .signOut()
                            .finally(() => {
                                return dispatch({ type: SIGNOUT });
                            });
                    });
                },
            });
        return unsubscribe;
    };
};

export const userFollowingsSnapshot = (error) => {
    return (dispatch) => {
        if (!auth().currentUser) return;
        const unsubscribe = firestore()
            .collection(DATABASE_CONSTANTS.USER)
            .doc(auth().currentUser.uid)
            .collection(DATABASE_CONSTANTS.FOLLOWINGS)
            .onSnapshot({
                next: (querySnapshot) => {
                    dispatch(
                        updateFollowing(
                            querySnapshot.docs.map((f) => {
                                return { id: f.id, ...f.data() };
                            }),
                        ),
                    );
                },
                error,
            });

        return unsubscribe;
    };
};

export const userFollowersSnapshot = (error) => {
    return (dispatch) => {
        if (!auth().currentUser) return;
        const unsubscribe = firestore()
            .collectionGroup(DATABASE_CONSTANTS.FOLLOWINGS)
            .where('uid', '==', auth().currentUser.uid)
            .onSnapshot({
                next: (querySnapshot) => {
                    dispatch(
                        updateFollowers(
                            querySnapshot.docs.map((f) => {
                                return { id: f.id, ...f.data(), uid: f.ref.parent.parent.id };
                            }),
                        ),
                    );
                },
                error,
            });

        return unsubscribe;
    };
};

export const userBlockedSnapshot = (error) => {
    return (dispatch) => {
        if (!auth().currentUser) return;
        return firestore()
            .collection(DATABASE_CONSTANTS.USER)
            .doc(auth().currentUser.uid)
            .collection(DATABASE_CONSTANTS.BLOCKED)
            .onSnapshot({
                next: (querySnapshot) => {
                    dispatch(
                        updateBlocked(
                            querySnapshot.docs.map((f) => {
                                return { id: f.id, ...f.data() };
                            }),
                        ),
                    );
                },
                error,
            });
    };
};

export const userMutedSnapshot = (error) => {
    return (dispatch) => {
        if (!auth().currentUser) return;
        return firestore()
            .collection(DATABASE_CONSTANTS.USER)
            .doc(auth().currentUser.uid)
            .collection(DATABASE_CONSTANTS.MUTED)
            .onSnapshot({
                next: (querySnapshot) => {
                    dispatch(
                        updateMuted(
                            querySnapshot.docs.map((f) => {
                                return { id: f.id, ...f.data() };
                            }),
                        ),
                    );
                },
                error,
            });
    };
};

export const signOut = () => {
    return async (dispatch) => {
        try {
            if (!auth().currentUser) return;
            const fcmToken = await messaging().getToken();
            await firestore()
                .collection(DATABASE_CONSTANTS.USER)
                .doc(auth().currentUser.uid)
                .update({
                    [USER_CONSTANTS.FCMTOKENS]: firestore.FieldValue.arrayRemove(fcmToken),
                });
            await FirebaseAnalytics.logSignOut();
            await auth().signOut();
            return dispatch({
                type: SIGNOUT,
            });
        } catch (error) {
            switch (error.code) {
                case 'auth/no-current-user':
                    return dispatch({
                        type: SIGNOUT,
                    });
                default:
                    console.log(error);
                    throw error;
            }
        }
    };
};
