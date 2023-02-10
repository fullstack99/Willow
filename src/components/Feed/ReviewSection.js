import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Linking } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { fonts, emoji } from '../../constants';
import StarSvg from '../../assets/Images/star.svg';
import { PRODUCT } from '../../navigator/constants';

const ReviewSection = ({ navigation, product }) => {
    const navigateToProduct = () => {
        navigation && navigation.push(PRODUCT, { productID: product.asin, productPrice: product?.price?.raw });
    };
    return (
        <TouchableOpacity style={styles.container} onPress={navigateToProduct}>
            {product.image && <FastImage source={{ uri: product.image }} style={styles.image} resizeMode={'contain'} />}
            <View style={styles.rightContainer}>
                <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                    {product.title}
                </Text>
                <View style={styles.bottomRow}>
                    <Text style={styles.price}>{product?.price?.raw || ''}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <StarSvg width={15} height={15} />
                        <Text style={styles.rating}>{product.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );
};

export default ReviewSection;

ReviewSection.propTypes = {
    navigation: PropTypes.object.isRequired,
    product: PropTypes.shape({
        asin: PropTypes.string.isRequired,
        title: PropTypes.string.isRequired,
        image: PropTypes.string.isRequired,
        price: PropTypes.shape({
            raw: PropTypes.string,
            value: PropTypes.number,
        }),
        rating: PropTypes.number,
        link: PropTypes.string,
    }),
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    image: {
        height: 80,
        width: 80,
        borderRadius: 15,
        marginRight: 10,
    },
    rightContainer: {
        flex: 1,
        justifyContent: 'space-around',
    },
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 18,
    },
    bottomRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
    },
    price: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 20,
    },
    rating: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 14,
        paddingLeft: 3,
    },
});
