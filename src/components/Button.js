import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../constants';

const Button = ({ disabled, disabledColor, width, height, style, onPress, fontWeight, textStyle, children }) => {
    return (
        <TouchableOpacity
            disabled={disabled}
            style={[
                styles.defaultContainer,
                { backgroundColor: disabled ? disabledColor : colors.PRIMARY_COLOR, height, width },
                style,
            ]}
            onPress={onPress}>
            {typeof children === 'string' ? (
                <Text style={[styles.defaultText, textStyle, { fontWeight }]}>{children}</Text>
            ) : (
                children
            )}
        </TouchableOpacity>
    );
};

Button.defaultProps = {
    disabled: false,
    disabledColor: colors.LIGHT_PRIMARY_COLOR,
    height: 80,
    width: '90%',
    fontWeight: 'bold',
};

Button.propTypes = {
    disabled: PropTypes.bool.isRequired,
    disabledColor: PropTypes.string.isRequired,
    height: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    width: PropTypes.oneOfType([PropTypes.number, PropTypes.string]).isRequired,
    onPress: PropTypes.func.isRequired,
    children: PropTypes.oneOfType([PropTypes.string, PropTypes.element]).isRequired,
    style: ViewPropTypes.style,
    textStyle: PropTypes.object,
    fontWeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
};

export default Button;

const styles = StyleSheet.create({
    defaultContainer: {
        borderWidth: 0,
        borderColor: 0,
        borderRadius: 30,
        marginLeft: 'auto',
        marginRight: 'auto',
        marginVertical: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    defaultText: {
        fontSize: 16,
        fontFamily: fonts.MULISH_BOLD,
        color: colors.WHITE,
        textAlign: 'center',
        alignItems: 'center',
    },
});
