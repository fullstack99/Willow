import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { fonts, colors } from '../../../constants';
import { SHARED_MEDIA } from '../../../navigator/constants';
import ShareMediaSvg from '../../../assets/Images/share-media.svg';
import BookSvg from '../../../assets/Images/book.svg';
import ArrowRightSvg from '../../../assets/Images/arrow-right.svg';

const MediaSection = ({ navigation, room }) => {
    const _navigateToSharedMedia = () => {
        navigation && room.id && navigation.push(SHARED_MEDIA, { roomID: room.id });
    };
    const _navigateToAppContent = () => {};

    return (
        <View style={styles.container}>
            <Text style={styles.title}>media</Text>
            <TouchableOpacity style={styles.mediaItem} onPress={_navigateToSharedMedia}>
                <View style={styles.mediaType}>
                    <ShareMediaSvg />
                    <Text style={styles.mediaTitle}>photo gallery</Text>
                </View>
                <ArrowRightSvg />
            </TouchableOpacity>
            {/* <TouchableOpacity style={styles.mediaItem} onPress={_navigateToAppContent}>
                <View style={styles.mediaType}>
                    <BookSvg />
                    <Text style={styles.mediaTitle}>app's content</Text>
                </View>
                <ArrowRightSvg />
            </TouchableOpacity> */}
        </View>
    );
};

export default MediaSection;

const styles = StyleSheet.create({
    container: {
        padding: 20,
    },
    title: {
        fontFamily: fonts.NEWYORKEXTRALARGE_BLACK,
        fontWeight: '500',
        fontSize: 18,
        color: colors.BLACK,
    },
    mediaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 20,
    },
    mediaType: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mediaTitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
        color: colors.BLACK,
        marginLeft: 15,
    },
});
