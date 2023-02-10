import React, { useEffect } from 'react';
import { SafeAreaView, StyleSheet, View, Text, Image, Keyboard } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { colors, fonts } from '../../constants';
import Button from '../../components/Button';
import FCMService from '../../service/firebase_messaging';
import { DISCOVER, MY_PROFILE, PROFILE, PROFILE_ADD_FRIEND } from '../../navigator/constants';

const TurnOnNotifications = ({ navigation }) => {
    // Dismiss unnecessary keyboard
    useEffect(() => {
        Keyboard.dismiss();
    }, []);

    const turnOnNotifications = async () => {
        try {
            await FCMService.requestUserPermission();
        } catch (error) {
            console.log(error);
        } finally {
            navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: PROFILE }],
                }),
            );
            navigation.navigate(PROFILE, { screen: PROFILE_ADD_FRIEND, initial: false });
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.image}>
                <Image
                    source={require('../../assets/Images/slider2.png')}
                    resizeMode={'cover'}
                    style={{ width: '100%', height: '100%' }}
                />
            </View>
            <View style={styles.messageContainer}>
                <Text style={styles.title}>be in the know!</Text>
                <Text style={styles.subtitle}>
                    don't worry, we don't spam and {'\n'}notifications are customizable in your settings!
                </Text>
            </View>
            <Button onPress={turnOnNotifications}>continue</Button>
        </SafeAreaView>
    );
};

export default TurnOnNotifications;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    image: {
        flex: 2,
        alignItems: 'center',
    },
    messageContainer: {
        flex: 1,
        alignItems: 'center',
        margin: 20,
    },
    message: {
        paddingVertical: 15,
    },
    title: {
        paddingVertical: 15,
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 30,
        textAlign: 'center',
    },
    subtitle: {
        paddingVertical: 15,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 18,
        textAlign: 'center',
    },
});
