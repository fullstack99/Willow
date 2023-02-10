const APP = 'app';
export const UPDATE_HOMEBUTTON = `${APP}/UPDATE_HOMEBUTTON`;
export const UPDATE_TABBAR = `${APP}/UPDATE_TABBAR`;
export const UPDATE_CURRENT_SCREEN = `${APP}/UPDATE_CURRENT_SCREEN`;
export const NAVIGATE_TO = `${APP}/NAVIGATE_TO`;
export const RESET_NAVIGATION = `${APP}/RESET_NAVIGATION`;

export const updateHomeButton = (visible) => ({
    type: UPDATE_HOMEBUTTON,
    visible,
});

export const updateTabBar = (visible) => ({
    type: UPDATE_TABBAR,
    visible,
});

export const updateCurrentScreen = (currentScreen) => ({
    type: UPDATE_CURRENT_SCREEN,
    currentScreen,
});

export const resetNavigation = () => ({
    type: RESET_NAVIGATION,
});

export const navigateTo = (screen, params) => ({
    type: NAVIGATE_TO,
    screen,
    params,
});
