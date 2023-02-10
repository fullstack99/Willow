import * as notificationActions from '../actions/notificationActions';

const INIT_STATE = {
    notifications: [],
    loading: false,
    error: '',
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case notificationActions.INIT:
            return {
                loading: false,
                error: '',
                notifications: action.notifications,
            };
        case notificationActions.SET_LOADING:
            return {
                ...state,
                loading: action.loading,
            };
        case notificationActions.ERROR:
            return {
                ...state,
                loading: false,
                error: action.error,
            };
        case notificationActions.RESET:
            return INIT_STATE;
        default:
            return state;
    }
};
