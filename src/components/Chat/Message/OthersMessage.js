import React, { useState, useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import PropTypes from 'prop-types';
import User from '../../../service/firebase_requests/User';
import MessageAvatar from './MessageAvatar';
import MessageBubble from './MessageBubble';
import MessageImages from './MessageImages';
import MessageTimestamp from './MessageTimestamp';
import MessageUsername from './MessageUsername';
import SharedPost from './SharedPost';
import SharedItem from './SharedItem';
import Poll from './Poll';

const OthersMessage = ({
    navigation,
    roomID,
    room,
    message,
    showAvatar,
    attachedMessage,
    openMessageActionDialog,
    openMessageLikesDialog,
    openImageDialog,
}) => {
    switch (message.type) {
        case 'share_item':
            return (
                <View style={styles.container}>
                    {showAvatar && (
                        <View style={styles.avatarContainer}>
                            <MessageAvatar navigation={navigation} messageUser={message.user} />
                        </View>
                    )}
                    <View>
                        {message.deleted ? (
                            <View style={styles.messageContainer}>
                                <MessageBubble
                                    roomID={roomID}
                                    room={room}
                                    message={message}
                                    attachedMessage={attachedMessage}
                                    openMessageActionDialog={openMessageActionDialog}
                                    openMessageLikesDialog={openMessageLikesDialog}
                                    openImageDialog={openImageDialog}
                                />
                            </View>
                        ) : (
                            <SharedItem
                                navigation={navigation}
                                product={message.product}
                                room={room}
                                message={message}
                                openMessageActionDialog={openMessageActionDialog}
                                openMessageLikesDialog={openMessageLikesDialog}
                            />
                        )}
                        <MessageTimestamp created_at={message?.created_at} />
                    </View>
                </View>
            );
        case 'share_post':
            return (
                <View style={styles.container}>
                    {showAvatar && (
                        <View style={styles.avatarContainer}>
                            <MessageAvatar navigation={navigation} messageUser={message.user} />
                        </View>
                    )}
                    <View>
                        {message.deleted ? (
                            <View style={styles.messageContainer}>
                                <MessageBubble
                                    roomID={roomID}
                                    room={room}
                                    message={message}
                                    attachedMessage={attachedMessage}
                                    openMessageActionDialog={openMessageActionDialog}
                                    openMessageLikesDialog={openMessageLikesDialog}
                                    openImageDialog={openImageDialog}
                                />
                            </View>
                        ) : (
                            <SharedPost
                                navigation={navigation}
                                postID={message.postID}
                                room={room}
                                message={message}
                                openMessageActionDialog={openMessageActionDialog}
                                openMessageLikesDialog={openMessageLikesDialog}
                            />
                        )}
                        <MessageTimestamp created_at={message?.created_at} />
                    </View>
                </View>
            );
        case 'poll':
            return (
                <View style={styles.container}>
                    {showAvatar && (
                        <View style={styles.avatarContainer}>
                            <MessageAvatar navigation={navigation} messageUser={message.user} />
                        </View>
                    )}
                    <View>
                        {message.deleted ? (
                            <View style={styles.messageContainer}>
                                <MessageBubble
                                    roomID={roomID}
                                    room={room}
                                    message={message}
                                    attachedMessage={attachedMessage}
                                    openMessageActionDialog={openMessageActionDialog}
                                    openMessageLikesDialog={openMessageLikesDialog}
                                    openImageDialog={openImageDialog}
                                />
                            </View>
                        ) : (
                            <View>
                                <MessageUsername roomType={room.type} message={message} />
                                <Poll
                                    navigation={navigation}
                                    room={room}
                                    message={message}
                                    openMessageActionDialog={openMessageActionDialog}
                                    openMessageLikesDialog={openMessageLikesDialog}
                                />
                            </View>
                        )}
                        <MessageTimestamp created_at={message?.created_at} />
                    </View>
                </View>
            );
        default:
            return (
                <View style={styles.container}>
                    {showAvatar && (
                        <View style={styles.avatarContainer}>
                            <MessageAvatar navigation={navigation} messageUser={message.user} />
                        </View>
                    )}
                    <View>
                        {Array.isArray(message?.images) && message?.images.length > 0 && (
                            <MessageImages
                                room={room}
                                message={message}
                                images={message.images}
                                openImageDialog={openImageDialog}
                                openMessageLikesDialog={openMessageLikesDialog}
                            />
                        )}
                        <View style={styles.messageContainer}>
                            <MessageBubble
                                roomID={roomID}
                                room={room}
                                message={message}
                                attachedMessage={attachedMessage}
                                openMessageActionDialog={openMessageActionDialog}
                                openMessageLikesDialog={openMessageLikesDialog}
                                openImageDialog={openImageDialog}
                            />
                        </View>
                        <MessageTimestamp created_at={message?.created_at} />
                    </View>
                </View>
            );
    }
};

OthersMessage.defaultProps = {
    showAvatar: false,
};

OthersMessage.propTypes = {
    navigation: PropTypes.object.isRequired,
    roomID: PropTypes.string.isRequired,
    message: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'images', 'share_post', 'share_item', 'poll']).isRequired,
        message: PropTypes.string,
        images: PropTypes.array,
        created_at: PropTypes.object.isRequired,
        user: PropTypes.shape({
            uid: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            avatar_url: PropTypes.string.isRequired,
        }).isRequired,
    }).isRequired,
    showAvatar: PropTypes.bool,
    attachedMessage: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'images', 'share_post', 'share_item', 'poll']).isRequired,
        message: PropTypes.string,
        images: PropTypes.array,
        created_at: PropTypes.object.isRequired,
        user: PropTypes.shape({
            uid: PropTypes.string.isRequired,
            name: PropTypes.string.isRequired,
            username: PropTypes.string.isRequired,
            avatar_url: PropTypes.string.isRequired,
        }).isRequired,
    }),
    openMessageActionDialog: PropTypes.func.isRequired,
    openMessageLikesDialog: PropTypes.func,
    openImageDialog: PropTypes.func.isRequired,
};

export default OthersMessage;

const styles = StyleSheet.create({
    container: {
        marginVertical: 10,
        maxWidth: '85%',
        flexDirection: 'row',
    },
    messageContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarContainer: {
        justifyContent: 'flex-end',
    },
});
