import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { emoji } from '../../../constants';

const MessageLikes = ({ myself, type, message, openMessageLikesDialog }) => {
    if (!type || !message || !Array.isArray(message?.likes) || message?.likes.length === 0) return null;

    if (type === 'direct_message') {
        return (
            <View style={[styles.container, myself ? styles.myselfContainer : styles.othersContainer]}>
                <Text>{emoji.heart}</Text>
            </View>
        );
    } else {
        return (
            <View style={[styles.container, myself ? styles.myselfContainer : styles.othersContainer]}>
                <TouchableOpacity onPress={() => openMessageLikesDialog && openMessageLikesDialog(message)}>
                    <Text>{emoji.heart}</Text>
                </TouchableOpacity>
            </View>
        );
    }
};

MessageLikes.defaultProps = {
    myself: false,
};

MessageLikes.propTypes = {
    myself: PropTypes.bool.isRequired,
    type: PropTypes.oneOf(['direct_message', 'public_forum', 'private_group']),
    message: PropTypes.shape({
        id: PropTypes.string.isRequired,
        likes: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }),
    openMessageLikesDialog: PropTypes.func,
};

export default MessageLikes;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        zIndex: 99,
        top: -4,
    },
    myselfContainer: {
        left: -6,
    },
    othersContainer: {
        right: -6,
    },
});
