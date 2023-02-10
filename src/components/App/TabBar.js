import React, { useState, useLayoutEffect, useRef } from 'react';
import { StyleSheet, View, Dimensions, ImageBackground, Animated } from 'react-native';
import { connect } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as Constants from '../../navigator/constants';
import FirebaseAnalytics from '../../service/firebase_analytics';
import AuthDialog from './AuthDialog';
import TabIcon from './TabIcon';
import MainButton from './MainButton';
import TabBarBackground from '../../assets/Images/tabbar.png';
import CreateChatDialog from '../../components/Chat/CreateChatDialog';
const { width } = Dimensions.get('window');

const TabBar = (props) => {
    const { state, descriptors, navigation, route, user, homeButtonVisible } = props;
    const focusedOptions = descriptors[state.routes[state.index].key].options;
    if (focusedOptions.tabBarVisible === false) {
        return null;
    }

    const [opacityAnimation, setOpacityAnimation] = useState(new Animated.Value(homeButtonVisible ? 1 : 0));
    const authDialogRef = useRef(null);
    const chatRef = useRef(null);
    const insets = useSafeAreaInsets();

    useLayoutEffect(() => {
        Animated.timing(opacityAnimation, {
            toValue: user && user.uid && homeButtonVisible ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [homeButtonVisible, user]);

    const onDirectChat = () => {
        FirebaseAnalytics.logCreatePrivateMessage();
        navigation.navigate(Constants.NEW_CHAT);
    };

    const onNewPublicForum = () => {
        FirebaseAnalytics.logCreatePublicForum();
        navigation.navigate(Constants.NEW_PUBLIC_FORUM);
    };

    const onBrowsePublicForum = () => {
        navigation.navigate(Constants.PUBLIC_FORUM, { from: 'browse_forum' });
    };

    return (
        <React.Fragment>
            <ImageBackground source={TabBarBackground} resizeMode="cover" style={styles.tabBarBackground}>
                <View style={styles.tabBarContainer}>
                    {state.routes.map((route, index) => {
                        return <TabIcon key={index} authDialogRef={authDialogRef} {...props} route={route} index={index} />;
                    })}
                </View>
                <Animated.View style={[styles.mainButtonContainer, { opacity: opacityAnimation }]}>
                    <MainButton navigation={navigation} state={state} chatRef={chatRef} />
                </Animated.View>
            </ImageBackground>
            <AuthDialog authDialogRef={authDialogRef} navigation={navigation} />
            <CreateChatDialog
                chatRef={chatRef}
                onClose={() => chatRef.current.close()}
                onDone={(phone) => {}}
                onDirectChat={onDirectChat}
                onNewPublicForum={onNewPublicForum}
                onBrowsePublicForum={onBrowsePublicForum}
            />
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    homeButtonVisible: state.app.homeButtonVisible,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(TabBar);

const styles = StyleSheet.create({
    tabBarContainer: {
        position: 'absolute',
        bottom: 0,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        height: 60,
        width: '100%',
    },
    tabBarBackground: {
        width,
        height: 60,
        position: 'absolute',
        bottom: 0,
        backgroundColor: 'transparent',
    },
    mainButtonContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
    },
});
