import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Dimensions,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    ImageBackground,
    Keyboard,
    KeyboardAvoidingView,
} from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { request, PERMISSIONS } from 'react-native-permissions';
import { updateEmail, updatePhoneNumber, updateAvatar, updateCountry } from '../../actions/registerActions';
import { colors, fonts } from '../../constants';
import * as COUNTRY_CONSTANTS from '../../constants/Country';
import User from '../../service/firebase_requests/User';
import * as USER_CONSTANTS from '../../constants/User';
import { validateEmail } from '../../utility';
import FirebaseError, { UNAVAILABLE_PHONE_NUMBER, INVALID_VERIFICATION_CODE, INVALID_EMAIL } from '../../service/firebase_errors';
import EThreeService from '../../service/virgil_security';
import { TURN_ON_NOTIFICATIONS } from '../../navigator/constants';
import Toast from '../../components/Toast';
import Button from '../../components/Button';
import AddPhotoDialog from '../../components/Dialogs/AddPhotoDialog';
import ChoosePhotoDialog from '../../components/Dialogs/ChoosePhotoDialog';
import VerifyCodeDialog from '../../components/Dialogs/VerifyCodeDialog';
import PhoneInput from '../../components/PhoneInput';
import AvatarBackgroundImage from '../../assets/Images/imageBack.png';
import DefaultAvatarImage from '../../assets/Images/avatar.png';
import CameraIcon from '../../assets/Images/upload.png';
import DeleteIcon from '../../assets/Images/delete.png';

const { scale } = Dimensions.get('window');
class SignupII extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            uploading: false,
            validate: false,
            focused: false,
            codeConfirm: null,
            granted: false,
            messageOneAnimation: new Animated.Value(1),
            messageTwoAnimation: new Animated.Value(0),
        };
        this.addPhotoDialogRef = React.createRef();
        this.choosePhotoDialogRef = React.createRef();
        this.verifyCodeDialogRef = React.createRef();
        this.emailRef = React.createRef();
    }

    componentDidMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', this.onKeyboardHideListener);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', this.onKeyboardShowListener);
    }

    componentWillUnmount() {
        this.keyboardDidHideListener.remove();
        this.keyboardDidShowListener.remove();
    }

    onKeyboardHideListener = () => {
        Animated.timing(this.state.messageTwoAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() =>
            this.setState({ ...this.state, focused: false }, () => {
                Animated.timing(this.state.messageOneAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }),
        );
    };

    onKeyboardShowListener = () => {
        Animated.timing(this.state.messageOneAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            this.setState({ ...this.state, focused: true }, () => {
                Animated.timing(this.state.messageTwoAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        });
    };

    setErrorToast = (error) => {
        this.setState({ ...this.state, error, uploading: false }, () => {
            setTimeout(() => this.setState({ ...this.state, error: '' }), 4000);
        });
    };

    setError = (error) => {
        this.setState({ ...this.state, error: error || '', uploading: false });
    };

    onChangePhoneNumber = (formatted, extracted) => {
        this.props.updatePhoneNumber(`${COUNTRY_CONSTANTS.countryCodes[this.props.country]} ${formatted}`, extracted);
        if (
            extracted.length === COUNTRY_CONSTANTS.countryMaxPhoneNumbersLength[this.props.country] &&
            this.props.email.length === 0
        ) {
            this.emailRef.current.focus ? this.emailRef.current.focus() : Keyboard.dismiss();
        }
        if (
            extracted.length === COUNTRY_CONSTANTS.countryMaxPhoneNumbersLength[this.props.country] &&
            this.props.email.length !== 0
        )
            Keyboard.dismiss();
    };

    avatarOnPress = () => {
        request(PERMISSIONS.IOS.PHOTO_LIBRARY)
            .then((result) => {
                if (result === 'granted' || result === 'limited') {
                    this.setState({ ...this.state, granted: true }, () => {
                        if (!this.props.avatar) {
                            this.choosePhotoDialogRef.current.open && this.choosePhotoDialogRef.current.open();
                        } else {
                            this.addPhotoDialogRef.current.open && this.addPhotoDialogRef.current.open();
                        }
                    });
                } else return;
            })
            .catch((error) => {
                forwardRef && forwardRef.current.close();
                setError ? setError(error) : console.log(error);
            });
    };

    chooseOnPress = () => {
        this.addPhotoDialogRef.current.close && this.addPhotoDialogRef.current.close();
        setTimeout(() => {
            this.choosePhotoDialogRef.current.open && this.choosePhotoDialogRef.current.open();
        }, 500);
    };

    deleteOnPress = () => {
        this.props.updateAvatar(null);
        this.addPhotoDialogRef.current.close && this.addPhotoDialogRef.current.close();
    };

    openVerifyCodeDialog = () => {
        !this.verifyCodeDialogRef.current.state.modalVisible &&
            this.verifyCodeDialogRef.current.open &&
            this.verifyCodeDialogRef.current.open();
    };

    closeVerifyCodeDialog = () => {
        this.verifyCodeDialogRef.current.state.modalVisible &&
            this.verifyCodeDialogRef.current.close &&
            this.verifyCodeDialogRef.current.close();
    };

    checkValidation = () => {
        return this.props.mobileNumber.length !== COUNTRY_CONSTANTS.countryMaxPhoneNumbersLength[this.props.country];
    };

    signUp = () => {
        Keyboard.dismiss();
        this.setState(
            {
                ...this.state,
                uploading: true,
            },
            async () => {
                try {
                    // Check if email is validated
                    if (!validateEmail(this.props.email)) throw { code: INVALID_EMAIL };
                    // Check if the phone number has already registered
                    const res = await User.checkIfPhoneNumberIsRegistered(this.props.phoneNumber);
                    if (res)
                        throw {
                            code: UNAVAILABLE_PHONE_NUMBER,
                        };
                    // Sign Up & Verify Code
                    const confirmation = await auth().signInWithPhoneNumber(this.props.phoneNumber);
                    this.setState({ ...this.state, codeConfirm: confirmation, uploading: false }, () =>
                        this.openVerifyCodeDialog(),
                    );
                } catch (error) {
                    this.closeVerifyCodeDialog();
                    return FirebaseError.setError(error, this.setError);
                }
            },
        );
    };

    onSelectCountry = (value) => {
        this.props.updateCountry(value);
    };

    onResend = async () => {
        this.signUp();
    };

    onConfirmation = async (text) => {
        this.setState({ ...this.state, uploading: true }, async () => {
            try {
                const userCredential = await this.state.codeConfirm.confirm(text);
                // Upload User's avatar to Storage
                const avatar_data = await User.uploadUserAvatar(this.props.avatar);
                // Create User's object
                const user = {};
                user[USER_CONSTANTS.NAME] = this.props.fullName;
                user[USER_CONSTANTS.USERNAME] = this.props.username;
                user[USER_CONSTANTS.EMAIL] = this.props.email;
                user[USER_CONSTANTS.AVATAR_URL] = avatar_data.avatar_url;
                user[USER_CONSTANTS.IMAGE_FILENAME] = avatar_data.filename;
                user[USER_CONSTANTS.PHONE_NUMBER] = this.props.phoneNumber;
                user[USER_CONSTANTS.COUNTRY] = this.props.country;
                user[USER_CONSTANTS.ROLE] = 'user';
                user[USER_CONSTANTS.CREATED_AT] = firestore.FieldValue.serverTimestamp();
                await User.setUserById(userCredential.user.uid, user);
                EThreeService.initialize().then(EThreeService.register);
                this.setState({ ...this.state, uploading: false }, this.closeVerifyCodeDialog);
                Keyboard.dismiss();

                this.props.navigation && this.props.navigation.navigate(TURN_ON_NOTIFICATIONS);
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
        });
    };

    render() {
        return (
            <React.Fragment>
                <View style={{ alignItems: 'center', zIndex: 200 }}>
                    <Toast error={this.state.error} close={() => this.setState({ error: '' })} />
                </View>
                {/* <LoadingDotsOverlay animation={this.state.uploading} /> */}
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView
                            style={styles.container}
                            contentContainerStyle={styles.container}
                            behavior="position"
                            keyboardVerticalOffset={80}>
                            <View style={styles.avatarSectionContainer}>
                                <ImageBackground
                                    source={AvatarBackgroundImage}
                                    resizeMode="contain"
                                    style={styles.avatarBackgroundImage}>
                                    <TouchableOpacity onPress={this.avatarOnPress} style={styles.avatarContainer}>
                                        <Image
                                            source={this.props.avatar ? { uri: this.props.avatar } : DefaultAvatarImage}
                                            resizeMode="contain"
                                            style={styles.avatar}
                                        />
                                        <View style={styles.avatarIconContainer}>
                                            <Image
                                                source={this.props.avatar ? DeleteIcon : CameraIcon}
                                                resizeMode="contain"
                                                style={styles.avatarIcon}
                                            />
                                        </View>
                                    </TouchableOpacity>
                                </ImageBackground>
                            </View>
                            {!(this.props.avatar && this.props.mobileNumber) && !this.state.focused && (
                                <Animated.Text
                                    style={[
                                        styles.avatarContentMessage,
                                        {
                                            transform: [
                                                {
                                                    scale: this.state.messageOneAnimation,
                                                },
                                            ],
                                        },
                                    ]}>
                                    {!this.props.avatar && this.props.mobileNumber
                                        ? `please upload a photo of yourself`
                                        : this.props.avatar && !this.props.mobileNumber
                                        ? `we also need your digits\n(you'll use your mobile # for signing in)`
                                        : `selfie time!\n and we also need your digits\n(you'll use your mobile # for signing in)`}
                                </Animated.Text>
                            )}
                            {this.state.focused && (
                                <Animated.Text
                                    style={[
                                        styles.avatarContentMessage,
                                        {
                                            transform: [
                                                {
                                                    scale: this.state.messageTwoAnimation,
                                                },
                                            ],
                                        },
                                    ]}>
                                    {`we will not share \nor sell this information`}
                                </Animated.Text>
                            )}

                            <View style={styles.inputSectionContainer}>
                                <PhoneInput
                                    onChangeText={this.onChangePhoneNumber}
                                    value={this.props.mobileNumber}
                                    containerStyle={styles.inputSection}
                                    infoContainerStyle={{ alignItems: 'center' }}
                                    country={this.props.country}
                                    onSelectCountry={this.onSelectCountry}
                                />
                                <View style={styles.inputSection}>
                                    <TextInput
                                        autoCorrect={false}
                                        autoCapitalize="none"
                                        keyboardType="email-address"
                                        label="email"
                                        ref={this.emailRef}
                                        value={this.props.email}
                                        style={styles.emailInput}
                                        onChangeText={this.props.updateEmail}
                                        returnKeyType="done"
                                        theme={{
                                            colors: {
                                                placeholder: '#a2a2a2',
                                                text: colors.BLACK,
                                                primary: this.props.email.length < 1 === '' ? 'red' : '#a2a2a2',
                                                underlineColor: 'transparent',
                                                backgroundColor: 'transparent',
                                                fontFamily: fonts.MULISH_SEMI_BOLD,
                                                fontSize: 15,
                                            },
                                        }}
                                    />
                                </View>
                            </View>
                            <Button disabled={this.checkValidation() || this.state.uploading} height={80} onPress={this.signUp}>
                                {this.state.uploading ? 'creating your account...' : 'next'}
                            </Button>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </SafeAreaView>

                <AddPhotoDialog
                    forwardRef={this.addPhotoDialogRef}
                    photo={this.props.avatar}
                    onChoosePress={this.chooseOnPress}
                    onDeletePress={this.deleteOnPress}
                />

                <ChoosePhotoDialog
                    forwardRef={this.choosePhotoDialogRef}
                    photo={this.props.avatar}
                    granted={this.state.granted}
                    onPhotoClick={this.props.updateAvatar}
                    setError={this.setErrorToast}
                />

                <VerifyCodeDialog
                    navigation={this.props.navigation}
                    verifying={this.state.uploading}
                    verifycodeRef={this.verifyCodeDialogRef}
                    onCodeConfirmation={this.onConfirmation}
                    onResend={this.onResend}
                    phoneNumber={this.props.phoneNumber}
                />
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    email: state.register.email,
    fullName: state.register.fullName,
    username: state.register.username,
    country: state.register.country,
    phoneNumber: state.register.phoneNumber,
    mobileNumber: state.register.mobileNumber,
    avatar: state.register.avatar,
});

const mapDispatchToProps = {
    updateEmail,
    updatePhoneNumber,
    updateAvatar,
    updateCountry,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupII);

const styles = StyleSheet.create({
    toastContainer: {
        alignItems: 'center',
        zIndex: 200,
    },
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    avatarSectionContainer: {
        height: scale > 2 ? 250 : 175,
        width: 300,
        alignItems: 'center',
        alignSelf: 'center',
        justifyContent: 'center',
    },
    avatarBackgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatarContainer: {
        height: '100%',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        height: scale > 2 ? 150 : 125,
        width: scale > 2 ? 150 : 125,
        borderRadius: scale > 2 ? 150 : 125 / 2,
    },
    avatarIconContainer: {
        alignItems: 'flex-end',
        bottom: 40,
        right: -55,
    },
    avatarIcon: {
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    avatarContentMessage: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 14,
        textAlign: 'center',
        marginHorizontal: 40,
    },
    inputSectionContainer: {
        flex: 1,
        marginHorizontal: 30,
    },
    inputSection: {
        flex: 1,
        justifyContent: 'center',
    },
    submitButtonSectionContainer: {
        justifyContent: 'flex-end',
    },
    numberInputText: {
        flex: 0.77,
        marginLeft: 30,
        paddingBottom: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#a2a2a2',
        fontSize: 20,
    },
    emailInput: {
        backgroundColor: 'transparent',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 20,
    },
});
