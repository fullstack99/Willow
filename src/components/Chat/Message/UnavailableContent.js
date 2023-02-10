import React from 'react';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { fonts, colors } from '../../../constants';

const UnavailableContent = ({ style, myself, message }) => {
    return (
        <View style={[styles.container, myself ? styles.myMessageContainer : styles.othersMessageContainer, style]}>
            <Text style={styles.message}>{message}</Text>
        </View>
    );
};

UnavailableContent.defaultProps = {
    myself: false,
    message: 'this content is unavailable',
};

UnavailableContent.propTypes = {
    style: ViewPropTypes.style,
    myself: PropTypes.bool.isRequired,
    message: PropTypes.string.isRequired,
};

export default UnavailableContent;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12.5,
        paddingVertical: 7.5,
        borderRadius: 25,
    },
    myMessageContainer: {
        backgroundColor: colors.LIGHT_PRIMARY_COLOR,
        borderBottomRightRadius: 0,
    },
    othersMessageContainer: {
        backgroundColor: colors.GREY,
        borderBottomLeftRadius: 0,
    },
    message: {
        fontStyle: 'italic',
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
});
