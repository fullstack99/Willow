import React from 'react';
import { StyleSheet, SafeAreaView, Text, View, Dimensions, Image } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import GlobalStyles from '../../../constants/globalStyles';
import { emoji, fonts } from '../../../constants';
import { SETTINGS, ABOUT_CHILDREN } from '../../../navigator/constants';
import BunInTheOven from '../../../assets/Images/Profile/bun_in_the_oven.png';
const { width, height } = Dimensions.get('window');

const BunOven = ({ navigation, route }) => {
    const selected = route.params.selected || [];

    const onAnimationEnd = () => {
        if (selected.indexOf('parent') !== -1) {
            navigation.navigate(ABOUT_CHILDREN);
        } else {
            navigation.navigate(SETTINGS);
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.alignCenterContainer}>
            <View style={styles.confettiOverlay}>
                <ConfettiCannon
                    autoStart
                    autoStartDelay={1000}
                    fadeOut
                    count={300}
                    origin={{ x: width * 0.5, y: height }}
                    fallSpeed={5000}
                    onAnimationEnd={onAnimationEnd}
                />
            </View>
            <View style={styles.container}>
                <Text style={styles.title}>{`congratulations ${emoji.star}`}</Text>
                <Text style={styles.message}>{`you've got a bun in the oven-\n very exciting!`}</Text>
                <Image source={BunInTheOven} style={styles.image} resizeMode="contain" />
            </View>
        </SafeAreaView>
    );
};

export default BunOven;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        marginTop: 80,
        alignItems: 'center',
    },
    confettiOverlay: {
        position: 'absolute',
        height: '100%',
        width: '100%',
        zIndex: 999,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        textAlign: 'center',
    },
    message: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        textAlign: 'center',
        paddingVertical: 20,
    },
    image: {
        marginHorizontal: 30,
        marginVertical: 40,
    },
});
