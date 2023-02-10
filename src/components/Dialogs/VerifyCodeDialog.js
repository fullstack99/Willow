import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';
import { CodeField, Cursor, useBlurOnFulfill, useClearByFocusCell } from 'react-native-confirmation-code-field';
import CountDown from 'react-native-countdown-component';
import { colors, fonts } from '../../constants';

const CELL_COUNT = 6;

const VerifyCodeDialog = ({ navigation, verifying, verifycodeRef, onCodeConfirmation, onResend, phoneNumber }) => {
    const [value, setValue] = useState('');
    const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue,
    });
    const [timerEnable, setTimerEnable] = useState(false);
    const [resendButtonDisable, setResendButtonDisable] = useState(false);

    const onValueChange = async (text) => {
        setValue(text);
        if (text.length === 6 && onCodeConfirmation && typeof onCodeConfirmation === 'function') {
            try {
                Keyboard.dismiss();
                await onCodeConfirmation(text);
            } catch (error) {
                throw error;
            }
        }
    };
    const onCountdownFinish = () => {
        setResendButtonDisable(false);
        setTimerEnable(true);
    };
    const resend = () => {
        setValue('');
        setTimerEnable(false);
        onResend();
    };

    return (
        <RBSheet
            ref={verifycodeRef}
            height={Dimensions.get('window').height * 0.4}
            animationType={'slide'}
            closeOnDragDown={true}
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <SafeAreaView style={styles.container}>
                    <Text style={styles.title}>verification code </Text>

                    <Text style={styles.sendTo}>sent to {phoneNumber} </Text>

                    <View style={styles.codeFieldContainer}>
                        <CodeField
                            ref={ref}
                            {...props}
                            value={value}
                            autoFocus
                            onFocus={() => {
                                if (value.length === 6) setValue('');
                            }}
                            onChangeText={onValueChange}
                            cellCount={CELL_COUNT}
                            textInputStyle={styles.cellText}
                            rootStyle={styles.codeFieldRoot}
                            keyboardType="number-pad"
                            textContentType="oneTimeCode"
                            renderCell={({ index, symbol, isFocused }) => (
                                <View style={styles.cellContainer}>
                                    <Text
                                        key={index}
                                        style={[styles.cell, isFocused && styles.focusCell]}
                                        onLayout={getCellOnLayoutHandler(index)}>
                                        {symbol || (isFocused ? <Cursor /> : null)}
                                    </Text>
                                </View>
                            )}
                        />
                    </View>
                    {verifying ? (
                        <View style={{ paddingTop: 30 }}>
                            <Text style={styles.missingVerificationCode}>verifying...</Text>
                        </View>
                    ) : !timerEnable ? (
                        <View style={{ paddingTop: 30 }}>
                            <Text style={styles.missingVerificationCode}>didn't receive a verification code?</Text>
                            <View style={styles.countdownContainer}>
                                <CountDown
                                    until={45}
                                    onFinish={onCountdownFinish}
                                    size={13}
                                    digitStyle={{ backgroundColor: colors.white }}
                                    digitTxtStyle={{ color: colors.BLACK, fontFamily: fonts.MULISH_REGULAR }}
                                    timeToShow={['S']}
                                    timeLabels={''}
                                />

                                <Text style={{ color: colors.DARK_GREY }}>seconds to resend</Text>
                            </View>
                        </View>
                    ) : (
                        <TouchableOpacity style={[styles.countdownContainer, { paddingTop: 30 }]} onPress={resend}>
                            <Text style={styles.resendText}>send another code</Text>
                        </TouchableOpacity>
                    )}
                </SafeAreaView>
            </TouchableWithoutFeedback>
        </RBSheet>
    );
};

const mapStateToProps = (state) => ({
    register: state.register,
});

const mapDispatchToProps = {};

VerifyCodeDialog.defaultProps = {
    verifying: false,
};

VerifyCodeDialog.propTypes = {
    onCodeConfirmation: PropTypes.func.isRequired,
    navigation: PropTypes.object.isRequired,
    verifying: PropTypes.bool.isRequired,
    verifycodeRef: PropTypes.object.isRequired,
    phoneNumber: PropTypes.string.isRequired,
    onResend: PropTypes.func.isRequired,
    setErrorToast: PropTypes.func,
};

export default connect(mapStateToProps, mapDispatchToProps)(VerifyCodeDialog);

const styles = StyleSheet.create({
    codeFieldRoot: { marginTop: 0 },
    cell: {
        fontSize: 20,
        margin: 5,
        textAlign: 'center',
        fontFamily: fonts.NEUTRA_BOOK,
    },
    focusCell: {
        borderColor: '#000',
    },
    dialogContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    title: {
        fontSize: 18,
        textAlign: 'center',
        color: 'black',
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        marginTop: 10,
    },
    sendTo: {
        fontSize: 15,
        textAlign: 'center',
        color: colors.DARK_GREY,
        fontFamily: fonts.MULISH_REGULAR,
        marginVertical: 20,
    },
    codeFieldContainer: {
        marginHorizontal: 20,
    },
    countdownContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    missingVerificationCode: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.DARK_GREY,
        textAlign: 'center',
    },
    resendText: {
        color: colors.DARK_GREY,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        textDecorationLine: 'underline',
        fontWeight: 'bold',
    },
    cellContainer: {
        width: Dimensions.get('window').width * 0.12,
        height: 50,
        margin: 5,
        backgroundColor: colors.GREY,
        borderRadius: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cellText: {
        fontFamily: fonts.NEUTRA_BOOK,
        fontSize: 20,
        color: colors.BLACK,
    },
});
