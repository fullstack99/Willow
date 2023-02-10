import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Switch, SafeAreaView, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { TextInput } from 'react-native-paper';
import { colors, fonts } from '../../../constants';
import GlobalStyles from '../../../constants/globalStyles';
import { CHATS, CHATTING } from '../../../navigator/constants';
import FirebasePublicForumChat from '../../../service/firebase_requests/PublicForumChat';
import FirebaseError from '../../../service/firebase_errors';
import Toast from '../../../components/Toast';
import Button from '../../../components/Button';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import ChatRoomAvatarUpload from '../../../components/Chat/Media/ChatRoomAvatarUpload';
import ChoosePhotoDialog from '../../../components/Dialogs/ChoosePhotoDialog';

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
const FORUM_ABOUT_MAX = 250;

const NewPublicForum = ({ navigation }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [forumAvatar, setForumAvatar] = useState(null);
    const [forumName, setForumName] = useState('');
    const [forumAbout, setForumAbout] = useState('');
    const [forumAboutLetterCount, setForumAboutLetterCount] = useState(FORUM_ABOUT_MAX);
    const [forumAdminApproval, setForumAdminApproval] = useState(false);
    const choosePhotoDialogRef = useRef();

    useEffect(() => {
        setForumAboutLetterCount(FORUM_ABOUT_MAX - forumAbout.length);
    }, [forumAbout]);

    const onCreatePublicForum = () => {
        const publicFroumRoom = {
            name: forumName,
            about: forumAbout,
            adminApprove: forumAdminApproval,
        };
        setLoading(true);
        FirebasePublicForumChat.createChat(publicFroumRoom, forumAvatar)
            .then((room) => {
                console.log(room);
                const navigationOption = CommonActions.reset({
                    index: 1,
                    routes: [{ name: CHATS }, { name: CHATTING, params: { room } }],
                });
                navigation && navigation.dispatch(navigationOption);
            })
            .catch((error) => FirebaseError.setError(error, setError))
            .finally(() => setLoading(false));
    };

    const toggleChoosePhotoDialog = () => {
        choosePhotoDialogRef.current && choosePhotoDialogRef.current.open();
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />

            <View style={styles.avatarContainer}>
                <ChatRoomAvatarUpload
                    avatar={forumAvatar}
                    toggleChoosePhotoDialog={toggleChoosePhotoDialog}
                    removeAvatar={() => setForumAvatar(null)}
                />
            </View>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    onChangeText={setForumName}
                    label="name"
                    theme={theme}
                    autoCapitalize="words"
                    returnKeyType="done"
                    value={forumName}
                />
                <TextInput
                    style={styles.input}
                    onChangeText={setForumAbout}
                    label="about"
                    theme={theme}
                    autoCapitalize="sentences"
                    returnKeyType="done"
                    value={forumAbout}
                    maxLength={FORUM_ABOUT_MAX}
                />
                <Text style={styles.letterCount}>{forumAboutLetterCount}</Text>
            </View>
            <View style={styles.switchContainer}>
                {/* <Text style={styles.text}>admin approval needed to join</Text>
                <Switch
                    trackColor={{ false: colors.GREY_2, true: colors.PRIMARY_COLOR }}
                    thumbColor={colors.WHITE_2}
                    ios_backgroundColor={colors.GREY_2}
                    onValueChange={setForumAdminApproval}
                    value={forumAdminApproval}
                /> */}
            </View>
            <Button onPress={onCreatePublicForum} disabled={loading || !forumName || !forumAvatar || !forumAbout}>
                create
            </Button>
            <ChoosePhotoDialog
                forwardRef={choosePhotoDialogRef}
                photo={forumAvatar}
                onPhotoClick={setForumAvatar}
                setError={setError}
                imagePickerOptions={{ width: 300, height: 300, cropperCircleOverlay: true }}
            />
        </SafeAreaView>
    );
};

export default NewPublicForum;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    avatarContainer: {
        margin: 20,
    },
    inputContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    input: {
        backgroundColor: colors.TRANSPARENT,
        fontFamily: fonts.NEWYORKEXTRALARGE_REGULAR,
        fontSize: 20,
        color: colors.BLACK,
        // textAlign: 'center',
        width: '100%',
        marginBottom: 20,
    },
    switchContainer: {
        flex: 1,
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    text: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.GREY_3,
    },
    letterCount: {
        alignSelf: 'flex-end',
        marginTop: 5,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.GREY_3,
    },
});
