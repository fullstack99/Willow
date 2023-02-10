import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../constants';
import { TIPS } from '../navigator/constants';

const TrendingTip = ({ data, navigation, style, width, height }) => {
    const onPress = () => {
        navigation && navigation.push(TIPS, { tipID: data.id });
    };
    return (
        <TouchableOpacity style={[styles.container, style, { width, height }]} onPress={onPress}>
            <View style={styles.imageContainer}>
                <FastImage resizeMode={FastImage.resizeMode.cover} style={styles.image} source={{ uri: data.image_url }} />
            </View>
            <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
                {data.title}
            </Text>
        </TouchableOpacity>
    );
};

TrendingTip.defaultProps = {
    width: 200,
    height: 300,
};

export default TrendingTip;

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
