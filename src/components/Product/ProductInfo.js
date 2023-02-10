import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import RatingIcon from '../../assets/Images/star.svg';
import { colors, fonts } from '../../constants';

const ProductInfo = ({ title, price, rating }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                {title}
            </Text>
            <View style={styles.statContainer}>
                {price ? <Text style={styles.price}>{price}</Text> : <View style={{ flex: 1 }} />}
                <View style={styles.ratingContainer}>
                    <RatingIcon />
                    <Text style={styles.rating}>{rating}</Text>
                </View>
            </View>
        </View>
    );
};

ProductInfo.propTypes = {
    title: PropTypes.string.isRequired,
    price: PropTypes.string,
    rating: PropTypes.number,
};

export default ProductInfo;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
    },
    statContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: 10,
    },
    price: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    rating: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
        paddingLeft: 5,
    },
});
