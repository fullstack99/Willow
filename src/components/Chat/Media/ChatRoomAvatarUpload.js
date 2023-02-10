import React from 'react';
import { StyleSheet, View, TouchableOpacity, ImageBackground, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';
import AvatarBackgroundImage from '../../../assets/Images/imageBack.png';
import DefaultAvatarImage from '../../../assets/Images/avatar.png';
import CameraIcon from '../../../assets/Images/camera.svg';
import DeleteIcon from '../../../assets/Images/remove.svg';
const { height } = Dimensions.get('window');

const ChatRoomAvatarUpload = ({ avatar, toggleChoosePhotoDialog, disabled, removeAvatar }) => {
    return (
        <ImageBackground source={AvatarBackgroundImage} resizeMode="contain" style={styles.container}>
            <View>
                <TouchableOpacity disabled={disabled} onPress={toggleChoosePhotoDialog}>
                    <FastImage
                        source={avatar ? { uri: avatar } : DefaultAvatarImage}
                        resizeMode={FastImage.resizeMode.contain}
                        style={styles.avatar}
                    />
                </TouchableOpacity>
                {!removeAvatar ? null : avatar ? (
                    <TouchableOpacity style={styles.camera} onPress={removeAvatar}>
                        <DeleteIcon />
                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.camera} onPress={toggleChoosePhotoDialog}>
                        <CameraIcon />
                    </TouchableOpacity>
                )}
            </View>
        </ImageBackground>
    );
};

ChatRoomAvatarUpload.defaultProps = {
    disabled: false,
};

export default ChatRoomAvatarUpload;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: height * 0.18,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        width: height * 0.18,
        height: height * 0.18,
        borderRadius: (height * 0.18) / 2,
    },
    camera: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
});
