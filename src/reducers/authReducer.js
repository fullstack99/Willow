import {
    UPDATE_USER,
    UPDATE_USER_ACCESSTOKEN,
    RESET_USER,
    SKIP_ONBOARDIMG_SCREENS,
    SIGNOUT,
    UPDATE_BLOCKED,
    UPDATE_MUTED,
    UPDATE_FOLLOWING,
    UPDATE_FOLLOWERS,
} from '../actions/authActions';

const INIT_STATE = {
    onBoardingScreens: false,
    user: null,
    following: [],
    followers: [],
    blocked: [],
    muted: [],
};

const INIT_STATE_WITH_ONBORADING = {
    user: null,
    following: [],
    followers: [],
    blocked: [],
    muted: [],
};

export default (state = INIT_STATE, action) => {
    switch (action.type) {
        case SKIP_ONBOARDIMG_SCREENS: {
            return { ...state, onBoardingScreens: action.payload };
        }
        case RESET_USER: {
            return { ...state, ...INIT_STATE_WITH_ONBORADING };
        }
        case UPDATE_USER: {
            return { ...state, user: action.payload };
        }
        case UPDATE_FOLLOWING: {
            return { ...state, following: action.following };
        }
        case UPDATE_FOLLOWERS: {
            return { ...state, followers: action.followers };
        }
        case UPDATE_BLOCKED: {
            return { ...state, blocked: action.blocked };
        }
        case UPDATE_MUTED: {
            return { ...state, muted: action.muted };
        }
        case SIGNOUT: {
            return { ...state, ...INIT_STATE_WITH_ONBORADING };
        }
        case UPDATE_USER_ACCESSTOKEN: {
            return { ...state, user: { ...state.user, accessToken: action.accessToken } };
        }
        default:
            return state;
    }
};
