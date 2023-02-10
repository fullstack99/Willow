import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

import { colors, fonts } from '../../constants';
const { width } = Dimensions.get('screen');
const ContentItem = ({ item }) => {
    return (
        <View style={styles.container}>
            <FastImage style={styles.thumbail} source={{ uri: item.thumbail }} />
            <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                {item.description}
            </Text>
            {item.price && <Text style={styles.price}>${parseFloat(item.price).toFixed(2)}</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginTop: 30,
        width: width / 2 - 20,
        marginHorizontal: 10,
    },
    thumbail: {
        maxWidth: width / 2 - 20,
        width: '100%',
        height: 200,
        borderRadius: 25,
    },
    description: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.BLACK,
        marginBottom: 10,
        marginTop: 15,
    },
    price: {
        fontFamily: fonts.NEWYORKEXTRALARGE_BLACK,
        fontSize: 18,
        fontWeight: '500',
        color: colors.BLACK,
    },
});
export default ContentItem;
