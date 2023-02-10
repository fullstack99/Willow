import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Dimensions, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import { colors, fonts } from '../../../constants';
import FirebaseChat from '../../../service/firebase_requests/Chat';
import FirebaseChatMessage from '../../../service/firebase_requests/ChatMessage';
import EThreeService from '../../../service/virgil_security';
import FirebaseErrors, { DATABASE_ERROR } from '../../../service/firebase_errors';
import PhotoGalleryThumbnail from './PhotoGalleryThumbnail';
import EmptyState from '../../Product/EmptyState';
const WINDOW_WIDTH = Dimensions.get('window').width;
const WINDOW_HEIGHT = Dimensions.get('window').height;

const PhotoGallery = ({ navigation, roomID, setError, setLoading, selectedImage, setSelectedImage }) => {
    const [gallery, setGallery] = useState(null);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const user = useSelector((state) => state.auth.user);
    const galleryRef = useRef();
    const thumbnailsRef = useRef();

    const _parseEncryptedImage = (image) => {
        return new Promise((resolve, reject) => {
            if (image?.encrypted) {
                const EThree = EThreeService.getEthree();
                if (image?.user === user?.uid) {
                    return FirebaseChatMessage.decryptImage(EThree, image)
                        .then(resolve)
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                } else {
                    return EThree.findUsers(image.user)
                        .then((imageAuthorCard) => {
                            return FirebaseChatMessage.decryptImage(EThree, image, imageAuthorCard)
                                .then(resolve)
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                        })
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                }
            } else {
                resolve(image);
            }
        });
    };

    useEffect(() => {
        setLoading(true);
        FirebaseChat.getChatRoomPhotoGallery(roomID)
            .then((data) => {
                if (Array.isArray(data) && data.length > 0) {
                    Promise.all(data.map((image) => _parseEncryptedImage(image)))
                        .then((data) => {
                            setGallery(data);
                        })
                        .catch((error) => FirebaseErrors.setError(error, setError))
                        .finally(() => setLoading(false));
                } else {
                    setLoading(false);
                    setGallery([]);
                }
            })
            .catch((error) => {
                setLoading(false);
                FirebaseErrors.setError(error, setError);
            });
    }, [roomID]);

    useEffect(() => {
        if (Array.isArray(gallery) && gallery.length > 0) setSelectedImage({ index: 0, ...gallery[0] });
    }, [gallery]);

    const setAspectRatio = (evt) => {
        const maxWidth = Dimensions.get('window').width;
        const maxHeight = Dimensions.get('window').height;
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setWidth(evt.nativeEvent.width * ratio);
        setHeight(evt.nativeEvent.height * ratio);
    };

    const onSave = (url) => {
        RNFetchBlob.config({
            fileCache: true,
            appendExt: 'png',
        })
            .fetch('GET', url)
            .then((res) => {
                CameraRoll.save(res.data, { type: 'photo' }).catch((error) =>
                    FirebaseErrors.setError({ code: DATABASE_ERROR }, setError),
                );
            })
            .catch((error) => FirebaseErrors.setError({ code: DATABASE_ERROR }, setError));
    };

    if (!Array.isArray(gallery)) return null;

    return (
        <View style={styles.container}>
            <View style={styles.imageContainer}>
                {gallery?.length > 0 ? (
                    <ImageViewer
                        ref={galleryRef}
                        imageUrls={gallery.map((image) => {
                            return { url: image?.image_url, props: { uri: image?.image_url } };
                        })}
                        useNativeDriver={true}
                        backgroundColor={colors.WHITE}
                        index={selectedImage?.index}
                        onChange={(index) => {
                            setSelectedImage({ index, ...gallery[index] });
                            thumbnailsRef.current && thumbnailsRef.current.scrollToIndex({ index, viewPosition: 0.5 });
                        }}
                        onSave={onSave}
                        menus={({ cancel, saveToLocal }) => (
                            <View style={[styles.menuContainer, { width: WINDOW_WIDTH, height: WINDOW_HEIGHT }]}>
                                <TouchableWithoutFeedback onPress={cancel}>
                                    <View style={[styles.menuShadow, { width: WINDOW_WIDTH, height: WINDOW_HEIGHT }]} />
                                </TouchableWithoutFeedback>
                                <View style={[styles.menuContent, { width: WINDOW_WIDTH }]}>
                                    <TouchableOpacity onPress={saveToLocal} style={styles.operateContainer}>
                                        <Text style={styles.operateText}>save to camera roll</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={cancel} style={styles.operateContainer}>
                                        <Text style={[styles.operateText, { color: colors.RED_2 }]}>cancel</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                        renderImage={({ uri }) => (
                            <FastImage
                                source={{ uri }}
                                style={{ width, height }}
                                resizeMode={FastImage.resizeMode.contain}
                                onLoad={setAspectRatio}
                            />
                        )}
                        renderIndicator={(currentIndex, allSize) => (
                            <View style={styles.indicatorContainer}>
                                <Text style={styles.indicator}>
                                    {currentIndex} of {allSize}
                                </Text>
                            </View>
                        )}
                        renderFooter={(currentIndex) => (
                            <FlatList
                                ref={thumbnailsRef}
                                keyExtractor={(item) => item.filename}
                                data={gallery}
                                initialNumToRender={6}
                                renderItem={({ item, index }) => (
                                    <PhotoGalleryThumbnail
                                        image={item}
                                        index={index}
                                        selected={currentIndex === index || false}
                                        setSelectedImage={setSelectedImage}
                                    />
                                )}
                                horizontal
                                showsHorizontalScrollIndicator={false}
                                style={{ flexGrow: 0 }}
                                contentContainerStyle={{ alignItems: 'center' }}
                            />
                        )}
                        footerContainerStyle={styles.footerContainer}
                    />
                ) : (
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                        <EmptyState title={'no images'} />
                    </View>
                )}
            </View>
        </View>
    );
};

PhotoGallery.propTypes = {
    navigation: PropTypes.object.isRequired,
    roomID: PropTypes.string.isRequired,
    setError: PropTypes.func,
    selectedImage: PropTypes.object,
    setSelectedImage: PropTypes.func.isRequired,
};

export default PhotoGallery;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    imageContainer: {
        flex: 1,
    },
    footerContainer: {
        position: 'absolute',
        bottom: 50,
    },
    indicatorContainer: {
        position: 'absolute',
        bottom: 10,
        zIndex: 99,
        width: '100%',
    },
    indicator: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 16,
        color: colors.PRIMARY_COLOR,
        textAlign: 'center',
    },
    menuContainer: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 12,
    },
    menuShadow: {
        position: 'absolute',
        backgroundColor: colors.BLACK,
        left: 0,
        bottom: 0,
        opacity: 0.2,
        zIndex: 10,
    },
    menuContent: {
        position: 'absolute',
        left: 0,
        bottom: 0,
        zIndex: 11,
    },
    operateContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        height: 80,
        borderBottomColor: colors.GREY_2,
        borderBottomWidth: 1,
    },
    operateText: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 22,
        color: colors.PRIMARY_COLOR,
    },
});
