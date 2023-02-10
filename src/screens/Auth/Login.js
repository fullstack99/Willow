import React, { Component } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    View,
    Image,
    KeyboardAvoidingView,
    Linking,
    Pressable,
    Keyboard,
    Platform,
} from 'react-native';
import { CommonActions } from '@react-navigation/native';
import Email from 'react-native-email';
import {
    getApplicationName,
    getBrand,
    getBuildNumber,
    getBuildId,
    getDeviceId,
    getSystemVersion,
} from 'react-native-device-info';
import auth from '@react-native-firebase/auth';
import Toast from '../../components/Toast';
import { connect } from 'react-redux';
import { colors, fonts, emoji } from '../../constants';
import * as COUNTRY_CONSTANTS from '../../constants/Country';
import Button from '../../components/Button';
import User from '../../service/firebase_requests/User';
import { updateUser } from '../../actions/authActions';
import PhoneInput from '../../components/PhoneInput';
import { DISCOVER, PROFILE } from '../../navigator/constants';
import VerifyCodeDialog from '../../components/Dialogs/VerifyCodeDialog';
import FirebaseError, { UNREGISTERED_PHONE_NUMBER, INVALID_VERIFICATION_CODE } from '../../service/firebase_errors';
import EThreeService from '../../service/virgil_security';
class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            country: COUNTRY_CONSTANTS.US,
            phoneNumber: '',
            mobileNumber: '',
            confirm: null,
            verifying: false,
        };
        this.RBSheet = React.createRef();
    }

    onChangeText = (formatted, extracted) => {
        this.setState(
            {
                error: '',
                phoneNumber: `${COUNTRY_CONSTANTS.countryCodes[this.state.country]} ${formatted}`,
                mobileNumber: extracted,
            },
            () => this.isValidPhoneNumber() && Keyboard.dismiss(),
        );
    };

    setError = (error) => {
        return this.setState({ error }, () => {
            setTimeout(() => this.setState({ ...this.state, error: '', verifying: false }), 4000);
        });
    };

    openVerifyCodeDialog = () => {
        !this.RBSheet.current.state.modalVisible && this.RBSheet.current.open && this.RBSheet.current.open();
    };

    closeVerifyCodeDialog = () => {
        this.RBSheet.current.state.modalVisible && this.RBSheet.current.close && this.RBSheet.current.close();
    };

    isValidPhoneNumber = () => {
        return this.state.mobileNumber.length === COUNTRY_CONSTANTS.countryMaxPhoneNumbersLength[this.state.country];
    };

    verifyCode = async () => {
        try {
            const res = await User.checkIfPhoneNumberIsRegistered(this.state.phoneNumber);
            if (!res) throw { code: UNREGISTERED_PHONE_NUMBER };
            const confirmation = await auth().signInWithPhoneNumber(this.state.phoneNumber);
            this.setState({ confirm: confirmation }, this.openVerifyCodeDialog);
        } catch (err) {
            this.closeVerifyCodeDialog();
            return FirebaseError.setError(err, this.setError);
        }
    };
    confirmCode = async (code) => {
        try {
            this.setState({ ...this.state, verifying: true });
            await this.state.confirm.confirm(code);
            await User.updateUserSessionCount();
            await EThreeService.initialize();
            this.setState({ ...this.state, verifying: false });
            this.closeVerifyCodeDialog();
            this.props.navigation.dispatch(
                CommonActions.reset({
                    index: 0,
                    routes: [{ name: PROFILE }],
                }),
            );
            this.props.navigation.navigate(DISCOVER);
        } catch (error) {
            console.log(error);
            switch (error.code) {
                case INVALID_VERIFICATION_CODE:
                    return FirebaseError.setError(error, this.setError);
                default:
                    this.closeVerifyCodeDialog();
                    return FirebaseError.setError(error, this.setError);
            }
        }
    };

    next = () => {
        if (this.isValidPhoneNumber()) {
            this.setState({ check: false, error: '' }, this.verifyCode);
        } else {
            FirebaseError.setError('invalid phone number', this.setError);
        }
    };

    onSelectCountry = (value) => {
        this.setState({ ...this.state, country: value, phoneNumber: '', mobileNumber: '' });
    };

    onResend = async () => {
        this.verifyCode();
    };

    onNeedHelp = async () => {
        try {
            const WILLOW_EMAIL = 'info@willow.app';
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
                subject: 'Help! I’m having trouble with logging in',
                body,
            });
        } catch (error) {
            if (error.message === 'Provided URL can not be handled') return;
            console.log(error.message);
            return FirebaseErrors.setError(error, setError);
        }
    };

    render() {
        return (
            <React.Fragment>
                <View style={{ alignItems: 'center', zIndex: 200 }}>
                    <Toast error={this.state.error} emoji={emoji.think} close={() => this.setState({ error: '' })} />
                </View>
                <Pressable style={styles.container} onPress={() => Keyboard.dismiss()}>
                    <KeyboardAvoidingView
                        style={styles.container}
                        behavior={Platform.OS == 'ios' ? 'padding' : 'position'}
                        contentContainerStyle={styles.container}
                        keyboardVerticalOffset={Platform.OS === 'ios' ? 85 : 0}>
                        <SafeAreaView style={styles.container}>
                            <View style={styles.imageContainer}>
                                <Image
                                    source={require('../../assets/Images/loginImage.png')}
                                    resizeMode={'contain'}
                                    style={styles.image}
                                />
                            </View>
                            <View style={styles.inputContainer}>
                                <PhoneInput
                                    onChangeText={this.onChangeText}
                                    autoFocus
                                    value={this.state.mobileNumber}
                                    containerStyle={{ marginTop: 20 }}
                                    infoClickable
                                    infoText={'need help?'}
                                    infoOnPress={this.onNeedHelp}
                                    infoContainerStyle={{ alignItems: 'flex-end' }}
                                    country={this.state.country}
                                    onSelectCountry={this.onSelectCountry}
                                />
                            </View>
                            <Button disabled={!this.isValidPhoneNumber()} onPress={this.next}>
                                next
                            </Button>
                        </SafeAreaView>
                    </KeyboardAvoidingView>
                </Pressable>
                <VerifyCodeDialog
                    navigation={this.props.navigation}
                    verifying={this.state.verifying}
                    verifycodeRef={this.RBSheet}
                    onCodeConfirmation={this.confirmCode}
                    onResend={this.onResend}
                    phoneNumber={this.state.phoneNumber}
                />
            </React.Fragment>
        );
    }
}
export default connect(null, { updateUser })(Login);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    imageContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    image: {
        width: '100%',
        height: '100%',
    },
    inputContainer: {
        flex: 1,
        marginHorizontal: 20,
    },
    verifyCodeContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
});
