import React, { useState, useEffect, useRef } from 'react';
import {
    StyleSheet,
    Text,
    ScrollView,
    View,
    ImageBackground,
    Image,
    TouchableOpacity,
    KeyboardAvoidingView,
    Dimensions,
    Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import User from '../../../service/firebase_requests/User';
import * as USER_CONSTANTS from '../../../constants/User';
import FirebaseError, { INVALID_USERNAME } from '../../../service/firebase_errors';
import { discardAlert, validateUsername } from '../../../utility';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import { TextInput } from 'react-native-paper';
import Background from '../../../assets/Images/Profile/account_avatar_background.png';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import Button from '../../../components/Button';
import Toast from '../../../components/Toast';
import ChoosePhotoDialog from '../../../components/Dialogs/ChoosePhotoDialog';
import DatePickerDialog from '../../../components/Dialogs/DatePickerDialog';
import PrivacyPreferenceDialog from '../../../components/Dialogs/PrivacyPreferenceDialog';
const { height } = Dimensions.get('window');

const theme = {
    colors: {
        placeholder: colors.DARK_GREY,
        text: colors.BLACK,
        primary: colors.DARK_GREY,
        underlineColor: 'transparent',
        backgroundColor: 'transparent',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
    },
};

const Account = ({ navigation, user }) => {
    const datePickerRef = useRef();
    const choosePhotoDialogRef = useRef();
    const privacyDialogRef = useRef();
    const firstUpdate = useRef(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [unsaved, setUnsaved] = useState(false);
    const [avatar, setAvatar] = useState(user[USER_CONSTANTS.AVATAR_URL]);
    const [name, setName] = useState(user[USER_CONSTANTS.NAME]);
    const [username, setUsername] = useState(user[USER_CONSTANTS.USERNAME]);
    const [aboutme, setAboutme] = useState(user[USER_CONSTANTS.ABOUT_ME]);
    const [birthday, setBirthday] = useState(user[USER_CONSTANTS.BIRTHDAY]);
    const [privacy_preference, setPrivacyPreference] = useState(user[USER_CONSTANTS.PRIVACY_PREFERENCE]);
    const [city, setCity] = useState(user[USER_CONSTANTS.LOCATION]);
    const [email, setEmail] = useState(user[USER_CONSTANTS.EMAIL]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!unsaved) return;

            e.preventDefault();
            Keyboard.dismiss();
            discardAlert(() => navigation.dispatch(e.data.action));
        });

        return () => unsubscribe && unsubscribe();
    }, [navigation, unsaved]);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        setUnsaved(true);
    }, [avatar, name, username, aboutme, birthday, city, email, privacy_preference]);

    const setToastError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 4000);
    };

    const onUsernameChange = (text) => {
        text.length > 0 && setUsername(text);
    };

    const openChoosePhotoDialog = () => {
        Keyboard.dismiss();
        !choosePhotoDialogRef.current.state.modalVisible &&
            choosePhotoDialogRef.current.open &&
            choosePhotoDialogRef.current.open();
    };

    const openDatePicker = () => {
        Keyboard.dismiss();
        !datePickerRef.current.state.modalVisible && datePickerRef.current.open && datePickerRef.current.open();
    };

    const onDateChange = (date) => {
        setBirthday(moment(date, 'YYYY/MM/DD').format('MM/DD/YYYY'));
    };

    const clearBirthday = () => {
        setBirthday('');
        datePickerRef.current.state.modalVisible && datePickerRef.current.close && datePickerRef.current.close();
    };

    const openPrvicayDialog = () => {
        Keyboard.dismiss();
        privacyDialogRef.current && privacyDialogRef.current.open();
    };

    const save = async () => {
        Keyboard.dismiss();
        setLoading(true);
        setUnsaved(false);
        try {
            // Check if username has changed, check if user has been registered
            if (user.username !== username) {
                await User.checkIfUsernameIsRegistered(username);
            }

            if (!validateUsername(username)) throw { code: INVALID_USERNAME };
            // Check if avatar has changed, upload if true
            let avatarData = {
                avatar_url: user.avatar_url,
                filename: user.imageFileName,
            };
            if (user.avatar_url !== avatar) {
                avatarData = await User.uploadUserAvatar(avatar);
            }
            const userData = {};
            userData[USER_CONSTANTS.AVATAR_URL] = avatarData.avatar_url;
            userData[USER_CONSTANTS.IMAGE_FILENAME] = avatarData.filename;
            userData[USER_CONSTANTS.NAME] = name;
            userData[USER_CONSTANTS.USERNAME] = username;
            userData[USER_CONSTANTS.PRIVACY_PREFERENCE] = privacy_preference;
            userData[USER_CONSTANTS.BIRTHDAY] = birthday;
            userData[USER_CONSTANTS.LOCATION] = city;
            userData[USER_CONSTANTS.ABOUT_ME] = aboutme;
            userData[USER_CONSTANTS.EMAIL] = email;

            await User.updateUser(userData);
            setLoading(false);
            return navigation.goBack();
        } catch (error) {
            setUnsaved(true);
            setLoading(false);
            return FirebaseError.setError(error, setError);
        }
    };

    return (
        <React.Fragment>
            <LoadingDotsOverlay animation={loading} />
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={120}>
                <ScrollView style={styles.container}>
                    <ImageBackground source={Background} style={styles.avatarBackground} resizeMode="contain">
                        <TouchableOpacity style={styles.avatarContainer} onPress={openChoosePhotoDialog}>
                            <Image source={{ uri: avatar }} style={styles.avatar} />
                        </TouchableOpacity>
                    </ImageBackground>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.title}>general information</Text>
                        <TextInput
                            label="name"
                            style={styles.input}
                            theme={theme}
                            autoCapitalize="words"
                            returnKeyType="done"
                            value={name}
                            onChangeText={setName}
                        />
                        <TextInput
                            label="username"
                            style={styles.input}
                            theme={theme}
                            autoCapitalize="none"
                            returnKeyType="done"
                            value={username}
                            onChangeText={onUsernameChange}
                            maxLength={16}
                        />
                        <View>
                            <TextInput
                                label="about me"
                                style={styles.input}
                                theme={theme}
                                autoCapitalize="none"
                                returnKeyType="done"
                                value={aboutme}
                                onChangeText={setAboutme}
                                maxLength={250}
                            />
                            <Text style={styles.counter}>{250 - aboutme.length}</Text>
                        </View>
                    </View>
                    <View style={styles.sectionContainer}>
                        <Text style={styles.title}>personal information</Text>
                        <TextInput
                            label="birthday"
                            style={styles.input}
                            theme={theme}
                            editable={false}
                            onTouchStart={openDatePicker}
                            showSoftInputOnFocus={false}
                            value={birthday}
                        />
                        <TextInput
                            label="city"
                            returnKeyType="done"
                            autoCapitalize="words"
                            style={styles.input}
                            theme={theme}
                            value={city}
                            onChangeText={setCity}
                        />
                        <TextInput
                            label="e-mail"
                            keyboardType="email-address"
                            autoCapitalize="none"
                            returnKeyType="done"
                            style={styles.input}
                            theme={theme}
                            value={email}
                            onChangeText={setEmail}
                        />
                    </View>

                    <View style={styles.sectionContainer}>
                        <Text style={styles.title}>privacy preference</Text>
                        <TextInput
                            label="account will be"
                            style={styles.input}
                            theme={theme}
                            editable={false}
                            onTouchStart={openPrvicayDialog}
                            showSoftInputOnFocus={false}
                            value={privacy_preference}
                        />
                    </View>

                    <Button disabled={loading || !unsaved || !name || username.length < 2} onPress={save}>
                        {loading ? 'saving...' : 'save'}
                    </Button>
                </ScrollView>
            </KeyboardAvoidingView>

            <DatePickerDialog
                forwardRef={datePickerRef}
                title={`don't worry, we don't show your actual birthday, but we do show your age`}
                onDateChange={onDateChange}
                date={birthday}
                clearDate={clearBirthday}
            />
            <ChoosePhotoDialog
                forwardRef={choosePhotoDialogRef}
                onPhotoClick={setAvatar}
                photo={avatar}
                setError={setToastError}
            />
            <PrivacyPreferenceDialog
                forwardRef={privacyDialogRef}
                privacy_preference={privacy_preference}
                setPrivacyPreference={setPrivacyPreference}
            />
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Account);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    dialogContainer: {
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    avatarBackground: {
        alignItems: 'center',
        marginVertical: 20,
    },
    avatarContainer: {
        width: 160,
        height: 160,
        borderWidth: 2,
        borderRadius: 160 / 2,
        borderStyle: 'dotted',
        borderColor: colors.DARKER_GREY,
        backgroundColor: colors.WHITE,
        padding: 10,
    },
    avatar: {
        width: '100%',
        height: '100%',
        borderRadius: 160 / 2,
    },
    sectionContainer: {
        marginHorizontal: 20,
        marginVertical: 10,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
    },
    input: {
        marginVertical: 30,
        backgroundColor: 'transparent',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 20,
    },
    counter: {
        position: 'absolute',
        bottom: 10,
        right: 5,
        color: colors.DARKER_GREY,
    },
    warningMessage: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 18,
        textAlign: 'center',
        paddingVertical: 15,
        paddingHorizontal: 40,
    },
});
