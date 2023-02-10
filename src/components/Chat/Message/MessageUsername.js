import React from 'react';
import { StyleSheet, Text, View, ViewPropTypes } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../../constants';

const MessageUsername = ({ roomType, message, style, textStyleProps }) => {
    const user = useSelector((state) => state.auth.user);
    const show = user?.uid !== message?.user.uid && roomType !== 'direct_message';
    if (show) {
        return (
            <View style={[styles.container, style]}>
                <Text style={[styles.name, textStyleProps]}>{message.user.name}</Text>
            </View>
        );
    } else return null;
};

MessageUsername.defaultProps = {
    style: {},
    textStyleProps: {},
};

MessageUsername.propTypes = {
    roomType: PropTypes.string.isRequired,
    message: PropTypes.shape({
        user: PropTypes.shape({
            uid: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            avatar_url: PropTypes.string.isRequired,
            username: PropTypes.string,
        }),
    }).isRequired,
    style: ViewPropTypes.style,
    textStyleProps: PropTypes.shape({
        fontWeight: PropTypes.string,
        fontSize: PropTypes.number,
        fontFamily: PropTypes.string,
        color: PropTypes.string,
    }),
};

export default MessageUsername;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 5,
    },
    name: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        color: colors.PRIMARY_COLOR,
    },
});
