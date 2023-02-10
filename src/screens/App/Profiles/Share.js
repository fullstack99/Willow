import React from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import GlobalStyles from '../../../constants/globalStyles';
import { fonts, emoji, colors } from '../../../constants';

const Share = () => {
    const QRCODE_URL = `https://6eagy.app.link/bcED9vZ9Ggb`;
    return (
        <SafeAreaView style={[GlobalStyles.alignCenterContainer, { justifyContent: 'center' }]}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{`have your friends scan me to download the app ${emoji.smile}`}</Text>
            </View>
            <View style={styles.QRCodeContainer}>
                <QRCode value={QRCODE_URL} size={Dimensions.get('window').width * 0.7} color={colors.PRIMARY_COLOR} />
            </View>
        </SafeAreaView>
    );
};

export default Share;

const styles = StyleSheet.create({
    titleContainer: {
        flex: 1,
        justifyContent: 'center',
        marginTop: 10,
        paddingHorizontal: 55,
    },
    title: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 20,
        textAlign: 'center',
    },
    QRCodeContainer: {
        flex: 2,
    },
});
