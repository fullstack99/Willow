import React, { useRef } from 'react';
import { connect } from 'react-redux';
import { NavigationContainer } from '@react-navigation/native';
import { updateHomeButton, updateTabBar, updateCurrentScreen } from '../actions/appActions';
import FirebaseAnalytics from '../service/firebase_analytics';
import * as constants from './constants';
import { colors } from '../constants';
import AppTabs from './App/AppTabs';

const defaultScreenOptions = { headerShown: false };

const AppNavigator = ({ updateHomeButton, updateTabBar, updateCurrentScreen }) => {
    const navigationRef = useRef();
    const routeNameRef = useRef();

    return (
        <NavigationContainer
            ref={navigationRef}
            theme={{
                colors: {
                    background: colors.WHITE,
                },
            }}
            onReady={() => (routeNameRef.current = navigationRef.current.getCurrentRoute().name)}
            onStateChange={async () => {
                const previousRouteName = routeNameRef.current;
                const currentRouteName = navigationRef.current.getCurrentRoute().name;

                if (previousRouteName !== currentRouteName) {
                    updateCurrentScreen(currentRouteName);
                    FirebaseAnalytics.logScreen(currentRouteName);
                    switch (currentRouteName) {
                        case constants.HOME:
                        case constants.FEEDS:
                        case constants.CHATS:
                            updateHomeButton(true);
                            updateTabBar(true);
                            break;
                        case constants.LOGIN:
                        case constants.SIGNUP_I:
                        case constants.SIGNUP_II:
                        case constants.TURN_ON_NOTIFICATIONS:
                        case constants.NEW_CHAT:
                        case constants.NEW_GRUOP:
                        case constants.NEW_PUBLIC_FORUM:
                        case constants.CHATTING:
                        case constants.SETTINGS:
                        case constants.ACCOUNT:
                        case constants.CHAT_SETTING:
                        case constants.ADD_FRIEND:
                        case constants.PRIVACY:
                        case constants.APP_CONTENT:
                        case constants.SHARED_MEDIA:
                        case constants.PUBLIC_FORUM:
                        case constants.NEW_POLL:
                        case constants.CHATTING_MEMBERS:
                        case constants.CONTACT_LIST:
                        case constants.STATUS:
                        case constants.BUN_OVEN:
                        case constants.ABOUT_CHILDREN:
                        case constants.NOTIFICATION_SETTINGS:
                        case constants.BLOCKLIST:
                        case constants.PROFILE_ADD_FRIEND:
                        case constants.FOLLOWERS:
                        case constants.CREATE_QUESTION:
                        case constants.CREATE_TIP:
                        case constants.CREATE_REVIEW:
                        case constants.TEXT_INPUT:
                        case constants.TIP_INPUT:
                        case constants.QUESTIONS:
                        case constants.BOOKMARKED:
                        case constants.NOTIFICATIONS:
                        case constants.SEARCH_PRODUCT:
                        case constants.PRODUCT:
                        case constants.REVIEWS:
                        case constants.SUPPORT:
                        case constants.SHARE:
                        case constants.WEBVIEW:
                        case constants.DIRECT_MESSAGE_SETTING:
                        case constants.PRIVATE_GROUP_SETTING:
                        case constants.ADD_ROOM_MEMBERS:
                        case constants.SHARE_IN_WILLOW:
                        case constants.QUICK_FRIEND:
                            updateTabBar(false);
                            break;
                        default:
                            updateHomeButton(false);
                            updateTabBar(true);
                            break;
                    }
                }

                routeNameRef.current = currentRouteName;
            }}
            screenOptions={defaultScreenOptions}>
            <AppTabs />
        </NavigationContainer>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    updateHomeButton,
    updateTabBar,
    updateCurrentScreen,
};

export default connect(mapStateToProps, mapDispatchToProps)(AppNavigator);
