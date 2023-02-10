import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableWithoutFeedback, Image, Animated, Dimensions } from 'react-native';
import { useSpring } from '../UseSpring';
import { colors, fonts } from '../../constants';
import FirebaseChat from '../../service/firebase_requests/Chat';
const tabWidth = Dimensions.get('window').width / 5;

const TabIcon = ({ descriptors, navigation, user, authDialogRef, state, route, index }) => {
    // Check unreadChat to display red dot
    const [unreadChat, setUnreadChat] = useState(false);
    useEffect(() => {
        let unsubscribe;
        if (user?.uid) {
            unsubscribe && unsubscribe();
            unsubscribe = FirebaseChat.checkIfAnyUnreadMessage(
                (unreadSnapshot) => setUnreadChat(unreadSnapshot.size > 0),
                console.log,
            );
        } else {
            unsubscribe && unsubscribe();
            unsubscribe = null;
        }

        return () => unsubscribe && unsubscribe();
    }, [user]);
    const { options } = descriptors[route.key];
    const label =
        options.tabBarLabel !== undefined ? options.tabBarLabel : options.title !== undefined ? options.title : route.name;

    const isFocused = state.index === index;
    const isAuthenticated = index === 1 || index === 3 || (user && user.uid);
    const isChat = index === 2;

    const onPress = () => {
        const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
        });

        if (!isFocused && !event.defaultPrevented && isAuthenticated) {
            navigation.navigate(route.name);
        } else if (!isFocused) {
            authDialogRef.current.open && authDialogRef.current.open();
        }
    };

    const animation = useSpring({ to: isFocused ? 1 : 0 }, { stiffness: 50 });
    const unreadDotAnimation = useSpring({ to: isFocused ? 0 : 1 }, { stiffness: 50 });
    const dotScale = animation;
    const unreadDotScale = unreadDotAnimation;
    const iconTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [0, 80],
    });
    const labelTranslate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [40, 10],
    });
    const iconVisibility = animation.interpolate({
        inputRange: [0, 1],
        outputRange: [1, 0],
    });
    const labelVisibility = animation;

    let iconImage = null;

    switch (index) {
        case 0:
            iconImage = require('../../assets/Images/grid.png');
            break;
        case 1:
            iconImage = require('../../assets/Images/Search.png');
            break;
        case 2:
            iconImage = require('../../assets/Images/chat.png');
            break;
        case 3:
            iconImage = require('../../assets/Images/profile.png');
            break;
    }

    return (
        <TouchableWithoutFeedback onPress={onPress}>
            <View style={[styles.container, { width: tabWidth, left: index > 1 ? tabWidth : 0 }]}>
                <Animated.Text
                    style={[
                        styles.label,
                        {
                            transform: [{ translateY: labelTranslate }],
                            opacity: labelVisibility,
                        },
                    ]}>
                    {label}
                </Animated.Text>

                <Animated.View
                    style={[
                        styles.icon,
                        {
                            transform: [{ translateY: iconTranslate }],
                            opacity: iconVisibility,
                        },
                    ]}>
                    <Image source={iconImage} resizeMode="contain" style={{ width: 25, height: 25 }} />
                </Animated.View>

                <Animated.View style={[styles.dot, { transform: [{ scale: dotScale }] }]} />

                {isChat && !isFocused && isAuthenticated && unreadChat && (
                    <View style={styles.unreadDotContainer}>
                        <Animated.View style={[styles.unreadDot, { transform: [{ scale: unreadDotScale }] }]} />
                    </View>
                )}
            </View>
        </TouchableWithoutFeedback>
    );
};

export default TabIcon;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        color: colors.BLACK,
    },
    label: {
        color: colors.BLACK,
        fontSize: 12,
        fontWeight: '600',
        letterSpacing: -0.2,
        fontFamily: fonts.NEUTRA_BOOK,
    },
    dot: {
        position: 'absolute',
        bottom: 8,
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: colors.PRIMARY_COLOR,
    },
    unreadDotContainer: {
        position: 'absolute',
        bottom: 16,
        right: 26,
        padding: 1,
        zIndex: 100,
        backgroundColor: colors.WHITE,
    },
    unreadDot: {
        width: 5,
        height: 5,
        borderRadius: 2.5,
        backgroundColor: colors.RED_2,
    },
});
