import React, { useState, useEffect } from 'react';
import { StyleSheet, Animated, View, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import { colors } from '../../constants';
import * as Constants from '../../navigator/constants';
import MaterialCommunityIcon from 'react-native-vector-icons/dist/MaterialCommunityIcons';
import StarIcon from '../../assets/Images/star-white.svg';
import QuestionIcon from '../../assets/Images/question-white.svg';
import PencilIcon from '../../assets/Images/pen-white.svg';
import AddChatIcon from '../../assets/Images/add_chat.svg';
import localNotificationService from '../../service/localNotificationService';
import HomeButtonBackground from '../../assets/Images/homebutton_background.svg';
import ShortHomeButtonBackground from '../../assets/Images/short_homebutton_background.svg';
const { width } = Dimensions.get('window');

const MainButton = ({ navigation, state, chatRef }) => {
    const [bottomButtons, setBottomButtons] = useState(true);
    const [fadeAnimation, setFadeAnimation] = useState(new Animated.Value(0));
    const currentScreen = useSelector((state) => state.app.currentScreen);
    const homeButtonVisible = useSelector((state) => state.app.homeButtonVisible);

    const buttons = [
        {
            key: 'tips',
            icon: <PencilIcon />,
            onPress: () => navigation.navigate(state.routeNames[state.index], { screen: Constants.TIP_INPUT }),
        },
        {
            key: 'reviews',
            icon: <StarIcon />,
            onPress: () => navigation.navigate(state.routeNames[state.index], { screen: Constants.CREATE_REVIEW }),
        },
        {
            key: 'questions',
            icon: <QuestionIcon />,
            onPress: () => navigation.navigate(state.routeNames[state.index], { screen: Constants.CREATE_QUESTION }),
        },
    ];

    const homeButtonSpin = fadeAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '135deg'],
        extrapolate: 'clamp',
    });

    useEffect(() => {
        if (currentScreen === Constants.CHATS) {
            setBottomButtons(!bottomButtons);
            Animated.timing(fadeAnimation, {
                toValue: 0,
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    }, [currentScreen]);

    const onPressMoreButton = () => {
        if (currentScreen === Constants.CHATS) {
            chatRef.current && chatRef.current.open();
        } else {
            bottomButtons && setBottomButtons(!bottomButtons);

            Animated.timing(fadeAnimation, {
                toValue: bottomButtons ? 1 : 0,
                duration: 500,
                useNativeDriver: true,
            }).start(({ finished }) => {
                if (finished) {
                    !bottomButtons && setBottomButtons(!bottomButtons);
                }
            });
        }
    };

    return (
        <React.Fragment>
            {homeButtonVisible && (
                <TouchableOpacity activeOpacity={0.6} style={[styles.moreButton]} onPress={onPressMoreButton}>
                    <Animated.View style={{ transform: [{ rotate: homeButtonSpin }], zIndex: 500 }}>
                        <MaterialCommunityIcon name="plus" size={30} color="white" />
                    </Animated.View>
                    <Animated.View style={{ position: 'absolute', bottom: 0, opacity: fadeAnimation }} pointerEvents="none">
                        <HomeButtonBackground width={width} />
                    </Animated.View>
                </TouchableOpacity>
            )}

            <Animated.View style={[styles.moreButtonsView, { display: bottomButtons ? 'none' : 'flex', opacity: fadeAnimation }]}>
                {buttons.map((b) => {
                    return (
                        <Animated.View key={b.key} style={{ opacity: fadeAnimation }}>
                            <TouchableOpacity activeOpacity={0.6} style={styles.smallButton} onPress={b.onPress}>
                                {b.icon}
                            </TouchableOpacity>
                        </Animated.View>
                    );
                })}
            </Animated.View>
        </React.Fragment>
    );
};

export default MainButton;

const styles = StyleSheet.create({
    moreButton: {
        position: 'absolute',
        bottom: 20,
        zIndex: 100,
        left: width / 2 - 63 / 2,
        height: 63,
        width: 63,
        borderRadius: 27,
        backgroundColor: colors.GREEN,
        alignItems: 'center',
        justifyContent: 'center',
    },
    moreButtonsView: {
        position: 'absolute',
        width: '100%',
        zIndex: 500,
        height: 80,
        borderRadius: 30,
        paddingHorizontal: width > 400 ? 70 : 50,
        bottom: 75,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    smallButton: {
        height: 50,
        width: 50,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.LIGHT_PRIMARY_COLOR,
    },
});
