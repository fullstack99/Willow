import React, { useState } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import Email from 'react-native-email';
import {
    getApplicationName,
    getBrand,
    getBuildNumber,
    getBuildId,
    getDeviceId,
    getSystemVersion,
} from 'react-native-device-info';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts, emoji } from '../../../constants';
import SupportBackground from '../../../assets/Images/support-background.png';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import FirebaseErrors from '../../../service/firebase_errors';
const WILLOW_EMAIL = 'info@willow.app';

const Support = ({ navigation }) => {
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const setAspectRatio = (evt) => {
        const maxHeight = Dimensions.get('window').height * 0.5;
        const maxWidth = Dimensions.get('window').width;
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setWidth(evt.nativeEvent.width * ratio);
        setHeight(evt.nativeEvent.height * ratio);
    };

    const sendEmail = async () => {
        setLoading(true);
        try {
            const to = [WILLOW_EMAIL]; // string or array of email addresses
            const deviceInfoPromises = await Promise.all([
                getBrand(),
                getDeviceId(),
                getSystemVersion(),
                getApplicationName(),
                getBuildNumber(),
                getBuildId(),
            ]);
            const body = `
            
                Brand: ${deviceInfoPromises[0]}
                Device: ${deviceInfoPromises[1].split(',')[0]}
                iOS Version: ${deviceInfoPromises[2]}
                Application Name: ${deviceInfoPromises[3]}
                Build Version: ${deviceInfoPromises[4]}
                Build ID: ${deviceInfoPromises[5]}`;
            await Email(to, {
                // Optional additional arguments
                subject: 'hi Willow! can you please help me?',
                body,
            });
        } catch (error) {
            if (error.message === 'Provided URL can not be handled') return;
            console.log(error.message);
            return FirebaseErrors.setError(error, setError);
        } finally {
            setLoading(false);
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.alignCenterContainer}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <FastImage
                source={SupportBackground}
                style={{ width, height }}
                resizeMode={FastImage.resizeMode.contain}
                onLoad={setAspectRatio}
            />
            <View style={styles.container}>
                <Text style={styles.title}>{`if you have any problems or just\n want to chat, email us ${emoji.heart}`}</Text>
                <Button onPress={sendEmail} disabled={loading} width={'85%'}>
                    send email
                </Button>
            </View>
        </SafeAreaView>
    );
};

export default Support;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
        marginHorizontal: 20,
    },
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        textAlign: 'center',
    },
});
