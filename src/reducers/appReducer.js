import { UPDATE_HOMEBUTTON, UPDATE_TABBAR, UPDATE_CURRENT_SCREEN, NAVIGATE_TO, RESET_NAVIGATION } from '../actions/appActions';

const initialState = {
    homeButtonVisible: true,
    tabBarVisible: true,
    currentScreen: 'Home',
    navigation: null,
};

export default (state = initialState, action) => {
    switch (action.type) {
        case UPDATE_HOMEBUTTON:
            return {
                ...state,
                homeButtonVisible: action.visible,
            };
        case UPDATE_TABBAR:
            return {
                ...state,
                tabBarVisible: action.visible,
            };
        case UPDATE_CURRENT_SCREEN:
            return {
                ...state,
                currentScreen: action.currentScreen,
            };
        case NAVIGATE_TO:
            return {
                ...state,
                navigation: {
                    screen: action.screen,
                    params: action.params,
                },
            };
        case RESET_NAVIGATION:
            return {
                ...state,
                navigation: null,
            };
        default:
            return state;
    }
};
