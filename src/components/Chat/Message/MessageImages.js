import React from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import ChatImage from '../Media/ChatImage';
import MessageLikes from './MessageLikes';

const MessageImages = ({ myself, room, images, message, openImageDialog, openMessageLikesDialog }) => {
    if (!Array.isArray(images) || images.length === 0) return null;

    return images.map((image, index) => (
        <View key={image?.filename || index.toString()} style={styles.container}>
            <MessageLikes myself={myself} type={room.type} message={image} openMessageLikesDialog={openMessageLikesDialog} />
            <ChatImage image={image} openImageDialog={() => openImageDialog(message, image)} />
        </View>
    ));
};

MessageImages.defaultProps = {
    myself: false,
};

MessageImages.propTypes = {
    myself: PropTypes.bool.isRequired,
    room: PropTypes.shape({
        id: PropTypes.string.isRequired,
        members: PropTypes.arrayOf(PropTypes.string.isRequired),
        type: PropTypes.oneOf(['direct_message', 'private_group', 'public_forum']).isRequired,
    }),
    images: PropTypes.arrayOf(PropTypes.shape({ image_url: PropTypes.string.isRequired })),
    message: PropTypes.shape({ id: PropTypes.string.isRequired }),
    openImageDialog: PropTypes.func.isRequired,
    openMessageLikesDialog: PropTypes.func,
};

export default MessageImages;

const styles = StyleSheet.create({
    container: {
        paddingBottom: 10,
    },
});
