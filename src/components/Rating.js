import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { fonts } from '../constants';
import YellowStar from '../assets/Images/review_yellow_star.svg';
import GreyStar from '../assets/Images/review_grey_star.svg';

const Rating = ({ rating, showNumber }) => {
    return (
        <View style={styles.container}>
            <View style={styles.starContainer}>
                {rating >= 1 ? <YellowStar style={styles.star} /> : <GreyStar style={styles.star} />}
            </View>
            <View style={styles.starContainer}>
                {rating >= 2 ? <YellowStar style={styles.star} /> : <GreyStar style={styles.star} />}
            </View>
            <View style={styles.starContainer}>
                {rating >= 3 ? <YellowStar style={styles.star} /> : <GreyStar style={styles.star} />}
            </View>
            <View style={styles.starContainer}>
                {rating >= 4 ? <YellowStar style={styles.star} /> : <GreyStar style={styles.star} />}
            </View>
            <View style={styles.starContainer}>
                {rating >= 5 ? <YellowStar style={styles.star} /> : <GreyStar style={styles.star} />}
            </View>
            {showNumber && <Text style={styles.rating}>{rating}</Text>}
        </View>
    );
};

Rating.defaultProps = {
    showNumber: false,
};
Rating.propTypes = {
    rating: PropTypes.number.isRequired,
    showNumber: PropTypes.bool.isRequired,
};

export default Rating;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    starContainer: {
        paddingHorizontal: 2.5,
    },
    star: {
        width: 10,
        height: 10,
    },
    rating: {
        paddingLeft: 2.5,
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
    },
});
