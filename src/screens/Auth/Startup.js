import React from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, TouchableOpacity, Dimensions } from 'react-native';
import { colors, fonts } from '../../constants';
import { SIGNUP, LOGIN } from '../../navigator/constants';
import GlobalStyles from '../../constants/globalStyles';
import Button from '../../components/Button';
import LogoImage from '../../assets/Images/loginImage.png';
import FirebaseAnalytics from '../../service/firebase_analytics';
const { height } = Dimensions.get('window');

const Startup = ({ navigation }) => {
    const navigateToLogin = () => {
        return navigation.navigate && navigation.navigate(LOGIN);
    };

    const navigateToSignUp = () => {
        FirebaseAnalytics.logSignUpClick();
        return navigation.navigate && navigation.navigate(SIGNUP);
    };

    return (
        <SafeAreaView style={GlobalStyles.containerWithTabBarHeight}>
            <View style={styles.imageContainer}>
                <Image source={LogoImage} resizeMode={'contain'} style={styles.image} />
            </View>
            <View style={styles.bottomContainer}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>log in to see what is happening in the willow community!</Text>
                </View>
                <Button height={height * 0.08} onPress={navigateToLogin}>
                    login
                </Button>
                <View style={styles.signUpContainer}>
                    <Text style={styles.signUpMessage}>don't have an account? </Text>
                    <TouchableOpacity onPress={navigateToSignUp}>
                        <Text style={styles.signUpText}> sign up</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default Startup;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    imageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 30,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    bottomContainer: {
        alignItems: 'center',
        padding: 10,
    },
    titleContainer: {
        paddingVertical: 15,
        width: '90%',
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        textAlign: 'center',
    },
    signUpContainer: {
        paddingVertical: 15,
        alignItems: 'center',
    },
    signUpMessage: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 16,
        textAlign: 'center',
    },
    signUpText: {
        textDecorationLine: 'underline',
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        textAlign: 'center',
    },
});
