import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, Platform, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { CircleSnail } from 'react-native-progress';
import { colors, fonts } from '../../constants';
import FirebasePublicForumChat from '../../service/firebase_requests/PublicForumChat';
import FirebaseChatMessage from '../../service/firebase_requests/ChatMessage';
import FirebaseUser from '../../service/firebase_requests/User';
import FirebaseErrors from '../../service/firebase_errors';
import Button from '../../components/Button';
import RecordIcon from '../../assets/Images/Chat/record-icon.svg';
import PhotoGalleryIcon from '../../assets/Images/Chat/photo-gallery-icon.svg';
import SendIcon from '../../assets/Images/Chat/send-icon.svg';
import AddIcon from '../../assets/Images/Chat/add-icon.svg';
import RemoveIcon from '../../assets/Images/remove.svg';
import ChoosePhotoDialog from '../../components/Dialogs/ChoosePhotoDialog';
import GroupChatOptionsDialog from '../../components/Chat/GroupChatOptionsDialog';
import { discardAlert } from '../../utility/';

const imagePickerOptions = {
    width: 400,
    height: 300,
    cropperCircleOverlay: false,
    includeBase64: true,
    writeTempFile: Platform.OS === 'ios' ? false : true,
};

const InputBar = ({
    init,
    loading,
    navigation,
    attachedMessage,
    onSendMessage,
    onEditOrReply,
    onClose,
    room,
    setError,
    editing,
    replying,
}) => {
    const [message, setMessage] = useState('');
    const [images, setImages] = useState([]);
    const [attachedMessageUser, setAttachedMessageUser] = useState(null);
    const user = useSelector((state) => state.auth.user);
    const choosePhotoDialogRef = useRef();
    const groupChatOptionsDialogRef = useRef();
    const isGroupChat = room?.type !== 'direct_message' || false;

    useEffect(() => {
        if (!attachedMessage) {
            setMessage('');
            setImages([]);
            setAttachedMessageUser(null);
        }
        if (replying && attachedMessage?.user) {
            setAttachedMessageUser(attachedMessage.user);
        }
        if (editing && attachedMessage?.id) {
            attachedMessage?.message && setMessage(attachedMessage.message);
            attachedMessage?.images && setImages(attachedMessage.images);
            setAttachedMessageUser(user);
        }
    }, [attachedMessage, replying, editing]);

    const onJoinForumClick = () => {
        if (room.adminApprove) {
            return FirebasePublicForumChat.requestToJoinForum(room.id).catch((error) =>
                setError ? FirebaseErrors.setError(error, setError) : console.log(error),
            );
        } else {
            return FirebasePublicForumChat.joinForum(room.id).catch((error) => {
                setError ? FirebaseErrors.setError(error, setError) : console.log(error);
            });
        }
    };

    const openMessageMediaDialog = () => {
        choosePhotoDialogRef.current && choosePhotoDialogRef.current.open();
    };

    const onAddIconPress = () => {
        if (isGroupChat) {
            groupChatOptionsDialogRef.current && groupChatOptionsDialogRef.current.open();
        } else {
            openMessageMediaDialog();
        }
    };

    const onImageClick = (image) => {
        setImages([...images, image]);
    };

    const removeImage = (index) => {
        const image = images[index];
        if (image?.id) {
            discardAlert(
                () => {
                    FirebaseChatMessage.deleteImage(image)
                        .then(() => setImages(images.filter((value, i) => i !== index)))
                        .catch((error) => FirebaseErrors.setError(error, setError));
                },
                'Delete Image',
                'Are you sure you want to delete this image?',
                'Delete',
                'Cancel',
            );
        } else {
            setImages(images.filter((value, i) => i !== index));
        }
    };

    const _renderInputBarIcon = () => {
        if (loading) {
            return (
                <View style={styles.spinner}>
                    <CircleSnail size={30} color={[colors.PRIMARY_COLOR, colors.LIGHT_PRIMARY_COLOR, '#DED1F1']} />
                </View>
            );
        } else if (message || images.length !== 0) {
            return (
                <TouchableOpacity
                    style={styles.sendButton}
                    onPress={() => {
                        if (editing || replying) {
                            onEditOrReply(message.trim(), images);
                        } else {
                            onSendMessage(message.trim(), images);
                        }
                        setMessage('');
                        setImages([]);
                    }}>
                    <SendIcon />
                </TouchableOpacity>
            );
        } else {
            return null;
            // <TouchableOpacity style={styles.sendButton} onPress={() => {}}>
            //                 <RecordIcon />
            //             </TouchableOpacity>
        }
    };

    if (!room || !room?.type || !room?.members) {
        return null;
    } else if (!user?.uid || (room.type === 'public_forum' && room.members.indexOf(user.uid) === -1)) {
        return (
            <View style={styles.inputContainer}>
                <Button onPress={onJoinForumClick} height={60}>
                    join forum
                </Button>
            </View>
        );
    } else {
        return (
            <View>
                {attachedMessage && attachedMessageUser && (
                    <View style={styles.receiverContainer}>
                        <View style={styles.receiverView}>
                            <View style={styles.receiverTopContainer}>
                                {attachedMessageUser?.avatar_url && (
                                    <FastImage
                                        source={{ uri: attachedMessageUser.avatar_url }}
                                        style={styles.avatar}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                )}
                                <Text style={styles.receiverName} numberOfLines={1} ellipsizeMode="tail">
                                    {attachedMessageUser?.name}
                                </Text>
                                <TouchableOpacity style={styles.cancelEditOrRemoveIcon} onPress={onClose}>
                                    <RemoveIcon />
                                </TouchableOpacity>
                            </View>
                            <Text style={styles.receiverMessage} numberOfLines={4} ellipsizeMode="tail">
                                {attachedMessage?.message}
                            </Text>
                        </View>
                    </View>
                )}

                {images.length > 0 && (
                    <FlatList
                        keyExtractor={(item, index) => index.toString()}
                        data={images}
                        renderItem={({ item, index }) => {
                            return (
                                <View style={styles.imageContainer}>
                                    <FastImage
                                        source={{ uri: item?.image_url || item?.path || item }}
                                        resizeMode={FastImage.resizeMode.stretch}
                                        style={styles.image}
                                    />
                                    <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                                        <RemoveIcon width={25} height={25} />
                                    </TouchableOpacity>
                                </View>
                            );
                            // if (item?.image_url && item?.mime && item.encrypted) {
                            //     return (
                            //         <View style={styles.imageContainer}>
                            //             <FastImage
                            //                 source={{ uri: `data:${item.mime};base64,${item.image_url}` }}
                            //                 resizeMode={FastImage.resizeMode.stretch}
                            //                 style={styles.image}
                            //             />
                            //             <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                            //                 <RemoveIcon width={25} height={25} />
                            //             </TouchableOpacity>
                            //         </View>
                            //     );
                            // } else {
                            //     return (
                            //         <View style={styles.imageContainer}>
                            //             <FastImage
                            //                 source={{ uri: item?.image_url || item?.path || item }}
                            //                 resizeMode={FastImage.resizeMode.stretch}
                            //                 style={styles.image}
                            //             />
                            //             <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                            //                 <RemoveIcon width={25} height={25} />
                            //             </TouchableOpacity>
                            //         </View>
                            //     );
                            // }
                        }}
                        horizontal
                        style={styles.imagesContainer}
                    />
                )}

                <View style={styles.inputContainer}>
                    <TouchableOpacity style={styles.addButton} onPress={onAddIconPress}>
                        <AddIcon />
                    </TouchableOpacity>
                    {isGroupChat && (
                        <TouchableOpacity style={styles.addButton} onPress={openMessageMediaDialog}>
                            <PhotoGalleryIcon color={colors.BLACK} />
                        </TouchableOpacity>
                    )}
                    <TextInput
                        placeholder="type a message..."
                        value={message}
                        onChangeText={setMessage}
                        style={styles.input}
                        autoCapitalize="sentences"
                        multiline
                        maxHeight={90}
                    />
                    {_renderInputBarIcon()}
                </View>

                {!init && (
                    <ChoosePhotoDialog
                        forwardRef={choosePhotoDialogRef}
                        onPhotoClick={onImageClick}
                        setError={setError}
                        imagePickerOptions={imagePickerOptions}
                    />
                )}
                {!init && room && (
                    <GroupChatOptionsDialog forwardRef={groupChatOptionsDialogRef} navigation={navigation} room={room} />
                )}
            </View>
        );
    }
};

export default InputBar;

const styles = StyleSheet.create({
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderTopWidth: 1,
        borderTopColor: colors.DARK_GREY,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    input: {
        flex: 1,
        paddingTop: 15,
        paddingVertical: 15,
        paddingLeft: 20,
        paddingRight: 50,
        borderRadius: 25,
        backgroundColor: '#F8F8F8',
    },
    addButton: {
        marginRight: 10,
    },
    sendButton: {
        position: 'absolute',
        right: 30,
        alignItems: 'center',
    },
    imagesContainer: {
        borderTopWidth: 1,
        borderTopColor: colors.DARK_GREY,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    imageContainer: {
        marginRight: 15,
    },
    image: {
        width: 80,
        height: 80,
        borderRadius: 25,
    },
    removeIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    receiverContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderTopWidth: 1,
        borderTopColor: colors.DARK_GREY,
    },
    receiverView: {
        flex: 1,
        marginLeft: 15,
    },
    receiverTopContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    receiverMessage: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        lineHeight: 20,
        fontWeight: 'normal',
        color: 'rgba(rgba(0, 0, 0, 0.8)',
    },
    receiverName: {
        flex: 1,
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.BLACK,
        marginBottom: 5,
        paddingHorizontal: 15,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    cancelEditOrRemoveIcon: {
        zIndex: 99,
    },
    spinner: {
        position: 'absolute',
        right: 30,
    },
});
