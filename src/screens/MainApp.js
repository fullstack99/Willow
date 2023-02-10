import React, { useEffect } from 'react';
import { View } from 'react-native';
import { connect } from 'react-redux';
import SplashScreen from 'react-native-splash-screen';
import auth from '@react-native-firebase/auth';
import branch, { BranchEvent } from 'react-native-branch';
import axiosRequest from '../service/axiosRequest';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as DATABASE_CONSTANTS from '../constants/Database';
import { navigateTo } from '../actions/appActions';
import {
    updateUserAccessToken,
    resetUser,
    userSnapshot,
    userFollowingsSnapshot,
    userFollowersSnapshot,
    userBlockedSnapshot,
    userMutedSnapshot,
} from '../actions/authActions';
import { notificationsInit } from '../actions/notificationActions';
import OnBoarding from '../screens/Auth/OnBoarding';
import AppNavigator from '../navigator/AppNavigator';
import FCMService from '../service/firebase_messaging';
import localNotificationService from '../service/localNotificationService';
import EThreeService from '../service/virgil_security';
import BranchService from '../service/branch_handlers';
import { onRegister, onNotification, onOpenNotification } from '../service/notificationHandlers';

const MainApp = ({
    onBoardingScreens,
    resetUser,
    userSnapshot,
    userFollowingsSnapshot,
    userFollowersSnapshot,
    userBlockedSnapshot,
    userMutedSnapshot,
    notificationsInit,
    navigateTo,
}) => {
    const insets = useSafeAreaInsets();

    useEffect(() => {
        SplashScreen.hide();
    }, []);

    useEffect(() => {
        let userUnsubscribe;
        let userFollowingsUnsubscribe;
        let userFollowersUnsubscribe;
        let userBlockedUnsubscribe;
        let userMutedUnsubscribe;
        let notificationsUnsubscribe;
        const unsubscribe = auth().onAuthStateChanged((user) => {
            if (user) {
                branch.setIdentity(user.uid);
                axiosRequest.configure(resetUser).then(() => {
                    !EThreeService.getEthree() && EThreeService.initialize();
                });
                FCMService.registerCurrentDeviceFCMToken().catch(console.log);
                userUnsubscribe = userSnapshot();
                userFollowingsUnsubscribe = userFollowingsSnapshot(console.log);
                userFollowersUnsubscribe = userFollowersSnapshot(console.log);
                userBlockedUnsubscribe = userBlockedSnapshot(console.log);
                userMutedUnsubscribe = userMutedSnapshot(console.log);
                notificationsUnsubscribe = notificationsInit();
            } else {
                resetUser();
                branch.logout();
                userUnsubscribe && userUnsubscribe();
                userFollowingsUnsubscribe && userFollowingsUnsubscribe();
                userFollowersUnsubscribe && userFollowersUnsubscribe();
                userBlockedUnsubscribe && userBlockedUnsubscribe();
                userMutedUnsubscribe && userMutedUnsubscribe();
                notificationsUnsubscribe && notificationsUnsubscribe();
                userUnsubscribe = null;
                userFollowingsUnsubscribe = null;
                userFollowersUnsubscribe = null;
                userBlockedUnsubscribe = null;
                userMutedUnsubscribe = null;
                notificationsUnsubscribe = null;
            }
        });

        FCMService.register(onRegister, onNotification, onOpenNotification, navigateTo);
        BranchService.register(navigateTo);
        // localNotificationService.configure(onOpenNotification);

        return () => {
            unsubscribe && unsubscribe();
            FCMService.unRegister();
            localNotificationService.unregister();
            BranchService.unRegister();
            userUnsubscribe && userUnsubscribe();
            userFollowingsUnsubscribe && userFollowingsUnsubscribe();
            userFollowersUnsubscribe && userFollowersUnsubscribe();
            userBlockedUnsubscribe && userBlockedUnsubscribe();
            userMutedUnsubscribe && userMutedUnsubscribe();
            notificationsUnsubscribe && notificationsUnsubscribe();
        };
    }, []);

    return (
        <View style={{ flex: 1, backgroundColor: 'transparent' }}>
            {onBoardingScreens === false ? (
                <React.Fragment>
                    <OnBoarding />
                </React.Fragment>
            ) : (
                <View style={{ flex: 1, marginBottom: insets.bottom }}>
                    <AppNavigator />
                </View>
            )}
        </View>
    );
};

const mapStateToProps = (state) => ({
    onBoardingScreens: state.auth.onBoardingScreens,
});

const mapDispatchToProps = {
    updateUserAccessToken,
    resetUser,
    userSnapshot,
    userFollowingsSnapshot,
    userFollowersSnapshot,
    userBlockedSnapshot,
    userMutedSnapshot,
    notificationsInit,
    navigateTo,
};

export default connect(mapStateToProps, mapDispatchToProps)(MainApp);
