import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../../constants';
import FirebaseUser from '../../../service/firebase_requests/User';
import MessageText from './MessageText';

const AttachedMessage = ({ message }) => {
    if (!message) return null;
    return (
        <View style={styles.container}>
            <View style={styles.messageVerticalLine} />
            <View>
                <Text style={styles.messageUser}>{message?.user.name || ''}</Text>
                <Text
                    style={[styles.message, { fontStyle: message?.edited_at ? 'italic' : 'normal' }]}
                    numberOfLines={4}
                    ellipsizeMode="tail">
                    {message?.deleted
                        ? 'this message has been deleted'
                        : message?.message === '[system message]: user has left the chat'
                        ? 'user has left the chat'
                        : message?.message}
                </Text>
            </View>
        </View>
    );
};

AttachedMessage.propTypes = {
    message: PropTypes.shape({
        id: PropTypes.string.isRequired,
        user: PropTypes.string.isRequired,
        message: PropTypes.string,
        images: PropTypes.arrayOf(PropTypes.string.isRequired),
        user: PropTypes.shape({
            uid: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
};

export default AttachedMessage;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingRight: 40,
        paddingTop: 5,
        paddingBottom: 10,
    },
    messageVerticalLine: {
        width: 2,
        height: '100%',
        marginRight: 10,
        backgroundColor: colors.PRIMARY_COLOR,
    },
    messageUser: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        color: colors.PRIMARY_COLOR,
        paddingBottom: 2.5,
    },
    message: {
        fontFamily: fonts.MULISH_REGULAR,
        color: colors.DARK_GREY,
        paddingBottom: 2.5,
    },
});
