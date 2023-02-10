import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity, ViewPropTypes } from 'react-native';
import Icon from 'react-native-vector-icons/dist/AntDesign';
import { colors, fonts, emoji } from '../constants/';
const { width } = Dimensions.get('window');

const Toast = ({ containerStyle, textStyle, buttonStyle, iconSize, iconName, error, emoji, close }) => {
    if (!error) return null;

    const onClosePress = () => typeof close === 'function' && close();

    return (
        <View style={[styles.container, containerStyle]}>
            <Text style={[styles.text, textStyle]}>{`${error} ${emoji}`}</Text>
            <TouchableOpacity style={[styles.button, buttonStyle]} onPress={onClosePress}>
                <Icon name={iconName} size={iconSize} color={colors.WHITE} />
            </TouchableOpacity>
        </View>
    );
};

Toast.defaultProps = {
    emoji: emoji.sad,
    iconSize: 20,
    iconName: 'close',
};

Toast.propTypes = {
    containerStyle: ViewPropTypes.style,
    buttonStyle: ViewPropTypes.style,
    iconSize: PropTypes.number,
    iconName: PropTypes.string,
    error: PropTypes.string,
    emoji: PropTypes.string,
    close: PropTypes.func.isRequired,
};

export default Toast;

const styles = StyleSheet.create({
    container: {
        backgroundColor: colors.RED,
        paddingHorizontal: 30,
        paddingVertical: 10,
        alignItems: 'center',
        flexDirection: 'row',
        width: width * 0.9,
        position: 'absolute',
        zIndex: 15,
        top: 0,
        borderRadius: 30,
    },
    text: {
        flex: 1,
        color: colors.WHITE,
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
        textAlign: 'center',
    },
    button: {
        marginLeft: 10,
    },
});
