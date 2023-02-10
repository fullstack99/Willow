import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../constants';
import { REVIEWS } from '../navigator/constants';

const UsefulReviews = ({ data, navigation, style, width, height }) => {
    const onPress = () => {
        navigation && navigation.push(REVIEWS, { reviewID: data.id });
    };
    return (
        <TouchableOpacity style={[styles.container, style, { width, height }]} onPress={onPress}>
            <View style={styles.imageContainer}>
                <FastImage
                    resizeMode={FastImage.resizeMode.contain}
                    style={styles.image}
                    source={{
                        uri:
                            Array.isArray(data?.image_url) && data.image_url.length > 0
                                ? data.image_url[0]
                                : data?.product?.image,
                    }}
                />
            </View>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
                {data.title}
            </Text>
        </TouchableOpacity>
    );
};

UsefulReviews.defaultProps = {
    width: 200,
    height: 300,
};

export default UsefulReviews;

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
        marginVertical: 20,
    },
    imageContainer: {
        flex: 1,
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 30,
    },
    bookmarkIcon: {
        position: 'absolute',
        top: 10,
        left: 10,
        width: 35,
        height: 35,
        color: colors.RED,
    },
    title: {
        marginVertical: 15,
        paddingHorizontal: 10,
        fontFamily: fonts.NEWYORKLARGE_REGULAR,
        color: colors.BLACK,
        fontSize: 18,
    },
});
