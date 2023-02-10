import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import * as DATABASE_CONSTANTS from '../constants/Database';

const NOTIFICATION = 'notification';
const NOTIFICATION_REF = firestore().collection(DATABASE_CONSTANTS.NOTIFICATION);

export const INIT = `${NOTIFICATION}/INIT`;
export const SET_LOADING = `${NOTIFICATION}/SET_LOADING`;
export const RESET = `${NOTIFICATION}/RESET`;
export const ERROR = `${NOTIFICATION}/ERROR`;

export const notificationsInit = () => {
    return (dispatch) => {
        return NOTIFICATION_REF.doc(auth().currentUser.uid)
            .collection(DATABASE_CONSTANTS.NOTIFICATIONS)
            .orderBy('created_at', 'desc')
            .onSnapshot(
                (querySnapshot) => {
                    dispatch({
                        type: INIT,
                        notifications: querySnapshot.docs.map((n) => {
                            return { id: n.id, ref: n.ref.path, ...n.data() };
                        }),
                    });
                },
                (error) => {
                    dispatch({ type: ERROR, error });
                },
            );
    };
};

export const resetNotifications = () => {
    return (dispatch) => {
        return dispatch({ type: RESET });
    };
};
