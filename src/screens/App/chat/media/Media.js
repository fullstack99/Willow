import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    FlatList,
    Dimensions,
    TouchableOpacity,
    Modal,
    View,
    Platform,
    PermissionsAndroid,
    Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import ImageViewer from 'react-native-image-zoom-viewer';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';

import { colors } from '../../../../constants';
import Chat from '../../../../service/firebase_requests/Chat';
import LoadingDotsOverlay from '../../../../components/LoadingDotsOverlay';

const { width } = Dimensions.get('screen');

const Media = ({ navigation, show }) => {
    const [galleryList, setGalleryList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [imagePath, setImagePath] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const { currentGroup } = useSelector((state) => state.chats);

    useEffect(() => {
        if (currentGroup) {
            setLoading(true);
            Chat.getAllMedia(currentGroup.id)
                .then((res) => {
                    const temp = res?._items.map((v) => {
                        return {
                            url: v?.path,
                        };
                    });
                    setGalleryList(temp);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log('get media error', error);
                });
        }
    }, []);

    const _renderItem = (item, from = null) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setVisible(true);
                    setImagePath(item.url);
                    setCurrentIndex(galleryList.findIndex((v) => v.url === item.url));
                }}>
                <FastImage style={from === 'footerList' ? styles.footerThumbnail : styles.thumbail} source={{ uri: item?.url }} />
            </TouchableOpacity>
        );
    };

    const getPermissionAndroid = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: 'Image Download Permission',
                message: 'Your permission is required to save images to your device',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            }
            Alert.alert(
                'Save remote Image',
                'Grant Me Permission to save Image',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        } catch (err) {
            Alert.alert(
                'Save remote Image',
                'Failed to save Image: ' + err.message,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }
    };

    const handleDownload = async () => {
        if (Platform.OS === 'android') {
            const granted = await getPermissionAndroid();
            if (!granted) {
                return;
            }
        }

        RNFetchBlob.config({
            fileCache: true,
            appendExt: 'png',
        })
            .fetch('GET', galleryList[currentIndex].url)
            .then((res) => {
                CameraRoll.saveToCameraRoll(res.data, 'photo')
                    .then((res) => console.log('photo download', res))
                    .catch((err) => console.log('photo download error', err));
            })
            .catch((error) => console.log(error));
    };

    if (!show) {
        return null;
    }

    return (
        <>
            <SafeAreaView style={styles.container}>
                <LoadingDotsOverlay animation={loading} />
                <FlatList
                    data={galleryList}
                    renderItem={({ item }) => _renderItem(item)}
                    keyExtractor={(item, index) => index}
                    style={styles.list}
                    numColumns={3}
                />
            </SafeAreaView>
            {visible ? (
                <Modal visible={visible} transparent={true} animationType="slide" onRequestClose={() => setVisible(false)}>
                    <SafeAreaView style={styles.modalContainer}>
                        <View style={styles.modalHeader}>
                            <FontAwesome
                                style={styles.modalIcon}
                                size={30}
                                name={'angle-left'}
                                onPress={() => setVisible(false)}
                            />
                            <FontAwesome style={styles.modalIcon} size={30} name={'download'} onPress={handleDownload} />
                        </View>
                    </SafeAreaView>
                    <ImageViewer
                        imageUrls={galleryList}
                        useNativeDriver={true}
                        enableSwipeDown={true}
                        onSwipeDown={() => {
                            setVisible(false);
                        }}
                        index={galleryList.findIndex((v) => v.url === imagePath)}
                        // renderFooter={(currentIndex) => (
                        //     <FlatList
                        //         data={galleryList}
                        //         renderItem={({ item }) => _renderItem(item, 'footerList')}
                        //         keyExtractor={(item, index) => index}
                        //         pagingEnabled={true}
                        //         showsHorizontalScrollIndicator={false}
                        //         horizontal
                        //     />
                        // )}
                        // footerContainerStyle={{
                        //     position: 'absolute',
                        //     bottom: 70,
                        // }}
                    />
                    <View style={styles.gallery}>
                        <FlatList
                            data={galleryList}
                            renderItem={({ item }) => _renderItem(item, 'footerList')}
                            keyExtractor={(item, index) => index}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                        />
                    </View>
                </Modal>
            ) : null}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
        alignItems: 'center',
    },
    list: {
        flex: 1,
        width: '100%',
        marginTop: 30,
    },
    thumbail: {
        width: width / 3 - 20,
        height: width / 3 - 20,
        borderRadius: 20,
        marginVertical: 5,
        marginHorizontal: 10,
    },
    footerThumbnail: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 5,
    },
    modalContainer: {
        backgroundColor: colors.BLACK,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    modalIcon: {
        color: colors.WHITE,
    },
    gallery: {
        paddingHorizontal: 20,
        height: 100,
        backgroundColor: colors.BLACK,
    },
});
export default Media;
