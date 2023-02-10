import React from 'react';
import { StyleSheet, View, Text, Image, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../constants';
import { PRODUCT } from '../navigator/constants';

const HotItems = ({ data, width, navigation }) => {
    const navigateToProduct = () => {
        navigation && navigation.push(PRODUCT, { productID: data.asin });
    };
    return (
        <TouchableOpacity style={[styles.container, { width }]} onPress={navigateToProduct}>
            <View style={{ flex: 1 }}>
                <Image resizeMode="contain" style={styles.image} source={{ uri: data.image }} />
            </View>
            <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.title}>
                {data.title}
            </Text>
            {data?.price && <Text style={styles.price}>{data.price?.raw || ''}</Text>}
        </TouchableOpacity>
    );
};

HotItems.defaultProps = {
    width: 200,
};

HotItems.propTypes = {
    data: PropTypes.shape({
        asin: PropTypes.string.isRequired,
        link: PropTypes.string,
        categories: PropTypes.array,
        title: PropTypes.string.isRequired,
        price: PropTypes.object,
        image: PropTypes.string.isRequired,
        rating: PropTypes.number,
    }),
    width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

export default HotItems;

const styles = StyleSheet.create({
    container: {
        marginRight: 10,
        marginVertical: 20,
        height: 300,
        width: 200,
    },
    image: {
        height: '100%',
        width: '100%',
        borderRadius: 25,
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
        fontFamily: fonts.NEWYORKLARGE_REGULAR,
        color: colors.BLACK,
        fontSize: 18,
    },
    price: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 20,
    },
});
