import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../constants';

const ListHeader = ({ title, onPress, titleContainerStyle, titleStyle }) => {
    return (
        <View style={[styles.container, titleContainerStyle]}>
            <Text style={[styles.title, titleStyle]}>{title}</Text>
            <TouchableOpacity onPress={onPress}>
                <Text style={styles.seeAll}>see all</Text>
            </TouchableOpacity>
        </View>
    );
};

ListHeader.propTypes = {
    title: PropTypes.string.isRequired,
    onPress: PropTypes.func.isRequired,
    titleContainerStyle: ViewPropTypes.style,
    titleStyle: PropTypes.object,
};

export default ListHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    title: {
        fontFamily: fonts.NEWYORKEXTRALARGE_SEMIBOLD,
        fontSize: 24,
    },
    seeAll: {
        color: colors.GREEN,
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 18,
        paddingRight: 20,
    },
});
