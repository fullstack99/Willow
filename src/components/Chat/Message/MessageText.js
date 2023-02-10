import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { fonts } from '../../../constants';
import { checkIfMessageIsEmojisOnly } from '../../../utility';

const MessageText = ({ children, edited, deleted }) => {
    const emojiOnly = checkIfMessageIsEmojisOnly(children);

    if (children === '[system message]: user has left the chat')
        return (
            <View style={styles.container}>
                <Text style={[styles.message, { fontStyle: 'italic' }]}>user has left the chat</Text>
            </View>
        );

    return (
        <View style={styles.container}>
            <Text style={[styles.message, emojiOnly && { fontSize: 40 }, (edited || deleted) && { fontStyle: 'italic' }]}>
                {deleted ? 'this message has been deleted' : children || ''}
            </Text>
        </View>
    );
};

MessageText.defaultProps = {
    deleted: false,
};

MessageText.propTypes = {
    children: PropTypes.string,
    edited: PropTypes.object,
    deleted: PropTypes.bool.isRequired,
};

export default MessageText;

const styles = StyleSheet.create({
    container: {},
    message: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
});
