import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import RNFetchBlob from 'rn-fetch-blob';
import CameraRoll from '@react-native-community/cameraroll';
import Feather from 'react-native-vector-icons/Feather';
import { colors, fonts } from '../../../../constants';
import GlobalStyles from '../../../../constants/globalStyles';
import FirebaseChat from '../../../../service/firebase_requests/Chat';
import FirebaseErrors, { DATABASE_ERROR } from '../../../../service/firebase_errors/';
import PhotoGallery from '../../../../components/Chat/Media/PhotoGallery';
import Toast from '../../../../components/Toast';
import LoadingDotsOverlay from '../../../../components/LoadingDotsOverlay';

const { width } = Dimensions.get('window');

const SharedMedia = ({ navigation, route }) => {
    const { roomID } = route.params;
    const [tabs, setTabs] = useState([
        { key: 0, title: 'gallery', focused: true, onPress: () => selectTab(0) },
        { key: 1, title: 'voice', focused: false, onPress: () => selectTab(1) },
        { key: 2, title: 'links', focused: false, onPress: () => selectTab(2) },
    ]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(!roomID ? 'server error' : '');
    const [selectedImage, setSelectedImage] = useState(null);

    if (!roomID)
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
            </SafeAreaView>
        );

    useLayoutEffect(() => {
        navigation &&
            navigation.setOptions({
                title: 'photo gallery',
                headerRight: () => (
                    <TouchableOpacity style={styles.downloadIcon} onPress={onDownloadImage}>
                        <Feather name="download-cloud" size={26} />
                    </TouchableOpacity>
                ),
            });
    }, [navigation, selectedImage]);

    const onDownloadImage = () => {
        selectedImage?.image_url &&
            RNFetchBlob.config({
                fileCache: true,
                appendExt: 'png',
            })
                .fetch('GET', selectedImage.image_url)
                .then((res) => {
                    CameraRoll.save(res.data, { type: 'photo' }).catch((err) =>
                        FirebaseErrors.setError({ code: DATABASE_ERROR }, setError),
                    );
                })
                .catch((error) => FirebaseErrors.setError({ code: DATABASE_ERROR }, setError));
    };

    const selectTab = (tabKey) => {
        if (tabKey > tabs.length - 1) {
            return;
        }
        return setTabs(tabs.map((t) => (t.key === tabKey ? { ...t, focused: true } : { ...t, focused: false })));
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            {/* <View style={styles.tabBarContainer}>
                {tabs.map((item) => (
                    <TouchableOpacity
                        key={item.key}
                        style={[
                            styles.tabTitleContainer,
                            { borderBottomColor: item.focused ? colors.PRIMARY_COLOR : colors.GREY },
                        ]}
                        onPress={item.onPress}>
                        <Text style={[styles.tabTitle, { color: item.focused ? colors.PRIMARY_COLOR : colors.BLACK }]}>
                            {item.title}
                        </Text>
                    </TouchableOpacity>
                ))}
            </View> */}
            <PhotoGallery
                navigation={navigation}
                roomID={roomID}
                setError={setError}
                setLoading={setLoading}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
            />
        </SafeAreaView>
    );
};

export default SharedMedia;

const styles = StyleSheet.create({
    downloadIcon: {
        marginRight: 20,
        paddingLeft: 10,
    },
    tabBarContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    tabTitleContainer: {
        width: width / 3,
        alignItems: 'center',
        borderBottomColor: colors.GREY,
        borderBottomWidth: 2,
        paddingVertical: 20,
    },
    tabTitle: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
});
