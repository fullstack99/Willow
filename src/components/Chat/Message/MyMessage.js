import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import PropTypes from 'prop-types';
import MessageImages from './MessageImages';
import MessageBubble from './MessageBubble';
import MessageTimestamp from './MessageTimestamp';
import SharedPost from './SharedPost';
import SharedItem from './SharedItem';
import Poll from './Poll';

const MyMessage = ({
    navigation,
    roomID,
    room,
    message,
    attachedMessage,
    openMessageActionDialog,
    openImageDialog,
    openMessageLikesDialog,
}) => {
    switch (message.type) {
        case 'share_item':
            return (
                <View style={styles.container}>
                    {message.deleted ? (
                        <View style={styles.messageContainer}>
                            <MessageBubble
                                myself
                                roomID={roomID}
                                room={room}
                                message={message}
                                attachedMessage={attachedMessage}
                                openMessageActionDialog={openMessageActionDialog}
                                openMessageLikesDialog={openMessageLikesDialog}
                            />
                        </View>
                    ) : (
                        <SharedItem
                            navigation={navigation}
                            product={message.product}
                            myself
                            room={room}
                            message={message}
                            openMessageActionDialog={openMessageActionDialog}
                            openMessageLikesDialog={openMessageLikesDialog}
                        />
                    )}
                    <MessageTimestamp myself created_at={message?.created_at} />
                </View>
            );
        case 'share_post':
            return (
                <View style={styles.container}>
                    {message.deleted ? (
                        <View style={styles.messageContainer}>
                            <MessageBubble
                                myself
                                roomID={roomID}
                                room={room}
                                message={message}
                                attachedMessage={attachedMessage}
                                openMessageActionDialog={openMessageActionDialog}
                                openMessageLikesDialog={openMessageLikesDialog}
                            />
                        </View>
                    ) : (
                        <SharedPost
                            navigation={navigation}
                            postID={message.postID}
                            myself
                            room={room}
                            message={message}
                            openMessageActionDialog={openMessageActionDialog}
                            openMessageLikesDialog={openMessageLikesDialog}
                        />
                    )}
                    <MessageTimestamp myself created_at={message?.created_at} />
                </View>
            );
        case 'poll':
            return (
                <View style={styles.container}>
                    {message.deleted ? (
                        <View style={styles.messageContainer}>
                            <MessageBubble
                                myself
                                roomID={roomID}
                                room={room}
                                message={message}
                                attachedMessage={attachedMessage}
                                openMessageActionDialog={openMessageActionDialog}
                                openMessageLikesDialog={openMessageLikesDialog}
                            />
                        </View>
                    ) : (
                        <Poll
                            navigation={navigation}
                            myself
                            room={room}
                            message={message}
                            openMessageActionDialog={openMessageActionDialog}
                            openMessageLikesDialog={openMessageLikesDialog}
                        />
                    )}
                    <MessageTimestamp myself created_at={message?.created_at} />
                </View>
            );
        default:
            return (
                <View style={styles.container}>
                    {Array.isArray(message?.images) && message?.images.length > 0 && (
                        <MessageImages
                            myself
                            room={room}
                            message={message}
                            images={message.images}
                            openImageDialog={openImageDialog}
                            openMessageLikesDialog={openMessageLikesDialog}
                        />
                    )}
                    <View style={styles.messageContainer}>
                        <MessageBubble
                            myself
                            roomID={roomID}
                            room={room}
                            message={message}
                            attachedMessage={attachedMessage}
                            openMessageActionDialog={openMessageActionDialog}
                            openMessageLikesDialog={openMessageLikesDialog}
                        />
                    </View>
                    <MessageTimestamp myself created_at={message?.created_at} />
                </View>
            );
    }
};

MyMessage.propTypes = {
    navigation: PropTypes.object.isRequired,
    roomID: PropTypes.string.isRequired,
    message: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'images', 'share_post', 'share_item', 'poll']).isRequired,
        message: PropTypes.string,
        images: PropTypes.array,
        created_at: PropTypes.object,
        user: PropTypes.shape({
            uid: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            avatar_url: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    attachedMessage: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'images', 'share_post', 'share_item', 'poll']).isRequired,
        message: PropTypes.string,
        images: PropTypes.array,
        created_at: PropTypes.object,
        user: PropTypes.shape({
            uid: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            avatar_url: PropTypes.string.isRequired,
        }).isRequired,
    }),
    openMessageActionDialog: PropTypes.func.isRequired,
    openImageDialog: PropTypes.func.isRequired,
    openMessageLikesDialog: PropTypes.func,
};

export default MyMessage;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        alignSelf: 'flex-end',
        maxWidth: '85%',
    },
    messageContainer: {
        flexDirection: 'row',
        alignSelf: 'flex-end',
    },
});
