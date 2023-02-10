import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { Slider } from 'react-native-elements';
import { fonts, colors } from '../../constants';

const RatingSlide = ({ title, rating, setRating }) => {
    return (
        <View style={styles.container}>
            <View style={styles.row}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.rating}>{rating}</Text>
            </View>
            <Slider
                value={rating}
                onValueChange={setRating}
                maximumValue={5}
                minimumValue={0}
                step={0.5}
                allowTouchTrack
                trackStyle={{ height: 7, borderRadius: 5 }}
                minimumTrackTintColor={colors.PRIMARY_COLOR}
                maximumTrackTintColor={colors.GREY}
                thumbStyle={{ height: 20, width: 20, borderWidth: 3, borderColor: colors.PRIMARY_COLOR }}
                thumbTintColor={colors.WHITE}
                thumbTouchSize={{ height: 20, width: 20 }}
            />
        </View>
    );
};

RatingSlide.propTypes = {
    title: PropTypes.string.isRequired,
    rating: PropTypes.number.isRequired,
    setRating: PropTypes.func.isRequired,
};

export default RatingSlide;

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.DARK_GREY,
    },
    rating: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
    },
});
