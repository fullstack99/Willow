import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import CustomFastImage from '../App/CustomFastImage';
import Button from '../Button';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import FirebaseAnalytics from '../../service/firebase_analytics';

const StatusReminder = ({ forwardRef, navigation }) => {
    const insets = useSafeAreaInsets();
    const onPress = () => {
        forwardRef.current && forwardRef.current.close();
        FirebaseAnalytics.logStatusReminderClick();
        setTimeout(
            () =>
                navigation &&
                navigation.navigate(NAVIGATOR_CONSTANTS.PROFILE, {
                    screen: NAVIGATOR_CONSTANTS.STATUS,
                    initial: false,
                }),
            500,
        );
    };
    const onGoBack = () => {
        forwardRef.current && forwardRef.current.close();
    };
    return (
        <RBSheet
            ref={forwardRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <View
                style={[
                    GlobalStyles.alignCenterContainer,
                    { justifyContent: 'space-evenly', width: '100%', marginTop: 10, marginBottom: insets.bottom + 20 },
                ]}>
                <Text style={styles.title}>
                    planning, expecting or already have little ones? tap here to complete your profile!
                </Text>
                <Button style={{ backgroundColor: colors.PRIMARY_COLOR }} onPress={onPress}>
                    take me there
                </Button>
                <TouchableOpacity onPress={onGoBack}>
                    <Text style={styles.amazon}>no, thanks</Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    );
};

export default StatusReminder;

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    amazon: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 16,
        color: colors.PRIMARY_COLOR,
    },
});
