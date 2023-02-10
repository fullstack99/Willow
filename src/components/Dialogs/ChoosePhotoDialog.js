import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, Linking, TouchableOpacity, Image, Platform } from 'react-native';
import PropTypes from 'prop-types';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RBSheet from 'react-native-raw-bottom-sheet';
import CameraRoll from '@react-native-community/cameraroll';
import ImagePicker from 'react-native-image-crop-picker';
import { fonts } from '../../constants';
import GlobalStyles from '../../constants/globalStyles';
import Button from '../Button';
import CameraIcon from '../../assets/Images/camera.png';
const { height, width } = Dimensions.get('window');

const ChoosePhotoDialog = ({ forwardRef, photo, granted, onPhotoClick, setError, imagePickerOptions }) => {
    const [loading, setLoading] = useState(true);
    // const [denied, setDenied] = useState(null);
    // const [granted, setGranted] = useState(null);
    const [photos, setPhotos] = useState(['camera']);
    const [p_pageinfo, setPhotoPageInfo] = useState(null);
    const insets = useSafeAreaInsets();

    // useEffect(() => {
    //     check(PERMISSIONS.IOS.PHOTO_LIBRARY)
    //         .then((result) => {
    //             switch (result) {
    //                 case RESULTS.UNAVAILABLE:
    //                     setDenied(false);
    //                     setGranted(false);
    //                     console.log('photo Library is not available (on this device / in this context)');
    //                     break;
    //                 case RESULTS.DENIED:
    //                     setDenied(true);
    //                     console.log('The permission has not been requested / is denied but requestable');
    //                     // allowPermission();
    //                     break;
    //                 case RESULTS.LIMITED:
    //                 case RESULTS.GRANTED:
    //                     setDenied(false);
    //                     setGranted(true);
    //                     console.log('The permission has been granted');
    //                     break;
    //                 case RESULTS.BLOCKED:
    //                     setDenied(false);
    //                     setGranted(false);
    //                     console.log('The permission is denied and not requestable anymore');
    //                     break;
    //                 default:
    //                     console.log('Not handled yet...');
    //                     break;
    //             }
    //         })
    //         .catch((error) => {
    //             setError ? setError(error) : console.log(error);
    //         });
    // }, []);

    useEffect(() => {
        if (granted) {
            CameraRoll.getPhotos({
                first: 11,
                assetType: 'Photos',
            })
                .then(concatPhotos)
                .catch((error) => {
                    switch (error.message) {
                        // case 'Access to photo library was denied':
                        //     return setGranted(false);
                        default:
                            return setError && setError(error.message);
                    }
                })
                .finally(() => setLoading(false));
        } else {
            setPhotos(['camera']);
            setPhotoPageInfo(null);
        }
    }, [granted]);

    const concatPhotos = (p) => {
        if (p.edges?.length > 0) {
            setPhotos(photos.concat(p.edges));
            setPhotoPageInfo(p.page_info);
        }
    };

    const onEndReached = () => {
        if (p_pageinfo?.has_next_page && !loading) {
            setLoading(true);
            CameraRoll.getPhotos({
                first: 24,
                after: p_pageinfo.end_cursor,
                assetType: 'Photos',
            })
                .then(concatPhotos)
                .catch((error) => {
                    switch (error.message) {
                        // case 'Access to photo library was denied':
                        //     return setGranted(false);
                        default:
                            return setError && setError(error.message);
                    }
                })
                .finally(() => setLoading(false));
        }
    };

    // const allowPermission = () => {
    //     request(PERMISSIONS.IOS.PHOTO_LIBRARY)
    //         .then((result) => {
    //             setDenied(false);
    //             setGranted(result === 'granted' || result === 'limited');
    //             forwardRef && forwardRef.current.close();
    //             forwardRef && setTimeout(() => forwardRef.current.open(), 500);
    //         })
    //         .catch((error) => {
    //             forwardRef && forwardRef.current.close();
    //             setError ? setError(error) : console.log(error);
    //         });
    // };

    const imageCallback = (image) => {
        if (image && onPhotoClick) {
            if (image?.data) {
                onPhotoClick({
                    data: image.data,
                    mime: image.mime,
                    path: image.path,
                    filename: image.filename || image.path.split('/').pop(),
                });
            } else {
                onPhotoClick(image.path);
            }
        }
        forwardRef.current.close && forwardRef.current.close();
    };

    const errorCallback = (error) => {
        switch (error.message) {
            case 'User cancelled image selection':
                break;
            default:
                setError && setError(error.message);
                forwardRef.current.close();
                break;
        }
    };

    return (
        <React.Fragment>
            <RBSheet
                ref={forwardRef}
                height={granted ? height * 0.7 : height * 0.3}
                animationType={'slide'}
                closeOnPressMask
                closeOnDragDown
                openDuration={250}
                customStyles={{
                    container: GlobalStyles.dialogContainer,
                }}>
                <View style={[GlobalStyles.alignCenterContainer, { justifyContent: 'center', width: '100%' }]}>
                    {/* {denied && (
                        <React.Fragment>
                            <Text style={styles.warningMessage}>
                                to proceed, we kindly ask that you allow access to your photo gallery. we do not copy, edit or
                                save your photos.
                            </Text>
                            <Button height={60} style={{ marginBottom: insets.bottom + 20 }} onPress={allowPermission}>
                                allow permission
                            </Button>
                        </React.Fragment>
                    )} */}

                    <React.Fragment>
                        <Text style={styles.title}>choose photo</Text>
                        <FlatList
                            numColumns={3}
                            contentContainerStyle={{
                                alignItems: 'center',
                                paddingBottom: insets.bottom + 40,
                            }}
                            data={photos}
                            keyExtractor={(item, index) => index}
                            showsHorizontalScrollIndicator={false}
                            onEndReached={onEndReached}
                            onEndReachedThreshold={0.016}
                            renderItem={({ item, index }) => {
                                if (item === 'camera') {
                                    return (
                                        <TouchableOpacity
                                            style={styles.squareContainer}
                                            onPress={() =>
                                                ImagePicker.openCamera({
                                                    cropping: true,
                                                    ...imagePickerOptions,
                                                })
                                                    .then(imageCallback)
                                                    .catch(errorCallback)
                                            }>
                                            <Image style={styles.square} source={CameraIcon} />
                                        </TouchableOpacity>
                                    );
                                } else {
                                    return (
                                        <TouchableOpacity
                                            style={styles.squareContainer}
                                            onPress={() =>
                                                ImagePicker.openCropper({
                                                    path: item.node.image.uri,
                                                    ...imagePickerOptions,
                                                })
                                                    .then(imageCallback)
                                                    .catch(errorCallback)
                                            }>
                                            <Image
                                                style={styles.square}
                                                source={{
                                                    uri: item.node.image.uri,
                                                }}
                                            />
                                        </TouchableOpacity>
                                    );
                                }
                            }}
                        />
                    </React.Fragment>

                    {/* {granted ? (
                        <React.Fragment>
                            <Text style={styles.title}>choose photo</Text>
                            <FlatList
                                numColumns={3}
                                contentContainerStyle={{
                                    alignItems: 'center',
                                    paddingBottom: insets.bottom + 40,
                                }}
                                data={photos}
                                keyExtractor={(item, index) => index}
                                showsHorizontalScrollIndicator={false}
                                onEndReached={onEndReached}
                                onEndReachedThreshold={0.016}
                                renderItem={({ item, index }) => {
                                    if (item === 'camera') {
                                        return (
                                            <TouchableOpacity
                                                style={styles.squareContainer}
                                                onPress={() =>
                                                    ImagePicker.openCamera({
                                                        cropping: true,
                                                        ...imagePickerOptions,
                                                    })
                                                        .then(imageCallback)
                                                        .catch(errorCallback)
                                                }>
                                                <Image style={styles.square} source={CameraIcon} />
                                            </TouchableOpacity>
                                        );
                                    } else {
                                        return (
                                            <TouchableOpacity
                                                style={styles.squareContainer}
                                                onPress={() =>
                                                    ImagePicker.openCropper({
                                                        path: item.node.image.uri,
                                                        ...imagePickerOptions,
                                                    })
                                                        .then(imageCallback)
                                                        .catch(errorCallback)
                                                }>
                                                <Image
                                                    style={styles.square}
                                                    source={{
                                                        uri: item.node.image.uri,
                                                    }}
                                                />
                                            </TouchableOpacity>
                                        );
                                    }
                                }}
                            />
                        </React.Fragment>
                    ) : granted !== null ? (
                        <React.Fragment>
                            <Text style={styles.warningMessage}>
                                to proceed, we kindly ask that you allow access to your photo gallery. we do not copy, edit or
                                save your photos.
                            </Text>
                            <Button
                                onPress={() => Linking.openURL('app-settings:')}
                                height={50}
                                style={{ marginBottom: insets.bottom + 20 }}>
                                change permission
                            </Button>
                        </React.Fragment>
                    ) : null} */}
                </View>
            </RBSheet>
        </React.Fragment>
    );
};

ChoosePhotoDialog.defaultProps = {
    imagePickerOptions: {
        width: 300,
        height: 400,
        cropperCircleOverlay: true,
    },
    granted: true,
};

ChoosePhotoDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    photo: PropTypes.oneOfType([PropTypes.string, PropTypes.shape({ uri: PropTypes.string })]),
    onPhotoClick: PropTypes.func.isRequired,
    setError: PropTypes.func,
    imagePickerOptions: PropTypes.shape({
        width: PropTypes.number.isRequired,
        height: PropTypes.number,
        aspectRatio: PropTypes.number,
        cropperCircleOverlay: PropTypes.bool,
    }),
};

export default ChoosePhotoDialog;

const styles = StyleSheet.create({
    warningMessage: {
        marginHorizontal: 40,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 18,
        textAlign: 'center',
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        marginVertical: 10,
        textAlign: 'center',
    },
    squareContainer: {
        margin: 8,
    },
    square: {
        width: width * 0.28,
        height: width * 0.28,
        borderRadius: 20,
    },
});
