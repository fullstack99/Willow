import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import YellowStar from '../../assets/Images/review_yellow_star.svg';

const RatingBar = ({ numberOfYellowStars, numberOfRatings, totalNumberOfRatings }) => {
    const precentage = (numberOfRatings / totalNumberOfRatings) * 100;
    const grey_precentage = ((totalNumberOfRatings - numberOfRatings) / totalNumberOfRatings) * 100;
    const createStars = () => {
        let stars = [];
        for (let i = 0; i < numberOfYellowStars; i++) {
            stars.push(<YellowStar key={i} style={styles.star} />);
        }
        return stars;
    };
    return (
        <View style={styles.ratingBarsContainer}>
            <View style={styles.starsRow}>{createStars()}</View>
            <View style={styles.bar}>
                <View style={[styles.yellowBar, { width: `${precentage}%` }]} />
                <View style={[styles.greyBar, { width: `${grey_precentage}%` }]} />
            </View>
        </View>
    );
};

RatingBar.propTypes = {
    numberOfYellowStars: PropTypes.number.isRequired,
    numberOfRatings: PropTypes.number.isRequired,
    totalNumberOfRatings: PropTypes.number.isRequired,
};

export default RatingBar;

const styles = StyleSheet.create({
    starsRow: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingVertical: 2,
        marginRight: 10,
    },
    star: {
        width: 10,
        height: 10,
        paddingRight: 10,
    },
    ratingBarsContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    bar: {
        flex: 1,
        flexDirection: 'row',
        paddingVertical: 2,
    },
    yellowBar: {
        height: 8,
        backgroundColor: '#FFE760',
        borderRadius: 20,
    },
    greyBar: {
        height: 8,
        backgroundColor: '#F8F8F8',
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
    },
});
