/* eslint-disable no-shadow */
import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    Animated,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Image,
    ImageBackground,
    Keyboard,
} from 'react-native';
import FastImage from 'react-native-fast-image';

import { colors, fonts } from '../../constants';
import AddPhotoDialog from '../../components/Dialogs/AddPhotoDialog';
import ChoosePhotoDialog from '../../components/Dialogs/ChoosePhotoDialog';
import AvatarBackgroundImage from '../../assets/Images/imageBack.png';
import DefaultAvatarImage from '../../assets/Images/avatar.png';
import CameraIcon from '../../assets/Images/upload.png';
import DeleteIcon from '../../assets/Images/delete.png';

const addPhotoDialogRef = React.createRef();
const choosePhotoDialogRef = React.createRef();
const messageOneAnimation = new Animated.Value(1);
const messageTwoAnimation = new Animated.Value(0);

const FileUpload = ({ navigation, setGroupImage, groupImg = null, from = null }) => {
    const [error, setError] = useState('');
    const [uploading, setUploading] = useState(false);
    const [focused, setFocused] = useState(false);
    const [avatar, setAvatar] = useState(null);

    useEffect(() => {
        const keyboardDidHideListener = Keyboard.addListener('keyboardWillHide', onKeyboardHideListener);
        const keyboardDidShowListener = Keyboard.addListener('keyboardWillShow', onKeyboardShowListener);
        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, []);

    useEffect(() => {
        if (groupImg) setAvatar(groupImg);
    }, [groupImg]);

    const onKeyboardHideListener = () => {
        Animated.timing(messageTwoAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() =>
            setFocused(false, () => {
                Animated.timing(messageOneAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            }),
        );
    };

    const onKeyboardShowListener = () => {
        Animated.timing(messageOneAnimation, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
        }).start(() => {
            setFocused(true, () => {
                Animated.timing(messageTwoAnimation, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }).start();
            });
        });
    };

    const setErrorToast = (error) => {
        setError(error);
        setUploading(false);
        setTimeout(() => setError(''), 4000);
    };

    const handleSetAvatar = (avatar) => {
        setAvatar(avatar);
        setGroupImage(avatar);
    };

    const avatarOnPress = () => {
        if (from === 'new_public_forum') {
            choosePhotoDialogRef.current.open && choosePhotoDialogRef.current.open();
            return;
        }
        if (!avatar) choosePhotoDialogRef.current.open && choosePhotoDialogRef.current.open();
        else addPhotoDialogRef.current.open && addPhotoDialogRef.current.open();
    };

    const deleteOnPress = () => {
        setAvatar(null);
        setGroupImage(null);
        addPhotoDialogRef.current.close && addPhotoDialogRef.current.close();
    };

    const chooseOnPress = () => {
        addPhotoDialogRef.current.close && addPhotoDialogRef.current.close();
        setTimeout(() => choosePhotoDialogRef.current.open && choosePhotoDialogRef.current.open(), 500);
    };

    return (
        <React.Fragment>
            <SafeAreaView style={styles.container}>
                <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                    <View style={styles.container}>
                        <View style={styles.avatarSectionContainer}>
                            <ImageBackground
                                source={AvatarBackgroundImage}
                                resizeMode="contain"
                                style={styles.avatarBackgroundImage}>
                                <TouchableOpacity onPress={avatarOnPress} activeOpacity={1}>
                                    <FastImage
                                        source={avatar ? { uri: avatar } : DefaultAvatarImage}
                                        resizeMode="contain"
                                        style={styles.avatar}
                                    />
                                    {from !== 'new_public_forum' && (
                                        <View style={styles.avatarIconContainer}>
                                            <Image
                                                source={avatar ? DeleteIcon : CameraIcon}
                                                resizeMode="contain"
                                                style={styles.avatarIcon}
                                            />
                                        </View>
                                    )}
                                </TouchableOpacity>
                            </ImageBackground>
                        </View>
                        {!avatar && !focused && (
                            <Animated.Text
                                style={[
                                    styles.avatarContentMessage,
                                    {
                                        transform: [
                                            {
                                                scale: messageOneAnimation,
                                            },
                                        ],
                                    },
                                ]}
                            />
                        )}
                    </View>
                </TouchableWithoutFeedback>
            </SafeAreaView>

            <AddPhotoDialog
                forwardRef={addPhotoDialogRef}
                photo={avatar}
                onChoosePress={chooseOnPress}
                onDeletePress={deleteOnPress}
            />

            <ChoosePhotoDialog
                forwardRef={choosePhotoDialogRef}
                photo={avatar}
                onPhotoClick={handleSetAvatar}
                setError={setErrorToast}
            />
        </React.Fragment>
    );
};

export default FileUpload;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.WHITE,
    },
    avatarSectionContainer: {
        height: 250,
        alignItems: 'center',
        justifyContent: 'center',
        marginHorizontal: 60,
    },
    avatarBackgroundImage: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        height: 175,
        width: 175,
        borderRadius: 175 / 2,
    },
    avatarIconContainer: {
        alignItems: 'flex-end',
        bottom: 40,
        right: 10,
    },
    avatarIcon: {
        width: 40,
        height: 40,
        borderRadius: 25,
    },
    avatarContentMessage: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 15,
        textAlign: 'center',
        marginHorizontal: 40,
    },
});
