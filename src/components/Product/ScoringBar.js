import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../constants';

const ScoringBar = ({ title, score }) => {
    const precentage = (score / 5) * 100;
    const grey_precentage = 100 - precentage;

    return (
        <View style={styles.container}>
            <View style={styles.titleContainer}>
                <Text style={styles.title}>{title}</Text>
                <Text style={styles.score}>{score}</Text>
            </View>
            <View style={{ flexDirection: 'row' }}>
                <View style={[styles.greenBar, { width: `${precentage}%` }]} />
                <View style={[styles.greyBar, { width: `${grey_precentage}%` }]} />
            </View>
        </View>
    );
};

ScoringBar.propTypes = {
    title: PropTypes.string.isRequired,
    score: PropTypes.number.isRequired,
};

export default ScoringBar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        marginVertical: 15,
    },
    titleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingBottom: 10,
    },
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
    },
    score: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
    },
    greenBar: {
        height: 10,
        backgroundColor: colors.PRIMARY_COLOR,
        borderRadius: 20,
    },
    greyBar: {
        height: 10,
        backgroundColor: '#F8F8F8',
        borderTopEndRadius: 20,
        borderBottomEndRadius: 20,
    },
});
