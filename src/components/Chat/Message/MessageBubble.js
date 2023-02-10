import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../../constants';
import FirebaseChat from '../../../service/firebase_requests/Chat';
import MessageText from './MessageText';
import MessageLikes from './MessageLikes';
import MessageUsername from './MessageUsername';
import AttachedMessage from './AttachedMessage';
import MultipleTouchable from '../../MultipleTouchable';

const MessageBubble = ({ myself, roomID, room, message, attachedMessage, openMessageActionDialog, openMessageLikesDialog }) => {
    if (!room || !message || !message?.id || !message.type || message?.type === 'images') return null;
    const user = useSelector((state) => state.auth.user);
    const disabled =
        message?.deleted ||
        room?.members?.indexOf(user?.uid) === -1 ||
        (message.number_of_images === 0 && !message.message) ||
        false;
    const _renderContent = () => {
        switch (message.type) {
            case 'text':
                return (
                    <View>
                        {/* {message.user.uid !== user.uid && room?.type !== 'direct_message' && (
                            <Text style={styles.name}>{message.user.name}</Text>
                        )} */}
                        <MessageUsername roomType={room?.type} message={message} />
                        <MessageText edited={message?.edited_at} deleted={message?.deleted}>
                            {message.message}
                        </MessageText>
                    </View>
                );
            case 'images':
                return null;
            case 'share_post':
            case 'share_item':
            case 'poll':
                return (
                    <View>
                        {/* {message.user.uid !== user.uid && room?.type !== 'direct_message' && (
                            <Text style={styles.name}>{message.user.name}</Text>
                        )} */}
                        <MessageUsername roomType={room?.type} message={message} />
                        <MessageText edited={message?.edited_at} deleted={message?.deleted}>
                            {message.message}
                        </MessageText>
                    </View>
                );
            default:
                return <MessageText>missing message's type!</MessageText>;
        }
    };

    const onDoubleTap = () => {
        if (!roomID || !message || !message.id || !Array.isArray(message.likes) || message.user.uid === user?.uid) return;
        FirebaseChat.likeMessage(roomID, message.id, message.likes.indexOf(user?.uid) === -1);
    };

    return (
        <View>
            <MessageLikes myself={myself} type={room.type} message={message} openMessageLikesDialog={openMessageLikesDialog} />
            {disabled ? (
                <View style={[styles.container, myself ? styles.myselfContainer : styles.othersContainer]}>
                    {attachedMessage && <AttachedMessage message={attachedMessage} />}
                    {_renderContent()}
                </View>
            ) : (
                <MultipleTouchable
                    onSingleTap={() => {}}
                    onDoubleTap={onDoubleTap}
                    onLongPress={() => openMessageActionDialog(message)}>
                    <View style={[styles.container, myself ? styles.myselfContainer : styles.othersContainer]}>
                        {attachedMessage && <AttachedMessage message={attachedMessage} />}
                        {_renderContent()}
                    </View>
                </MultipleTouchable>
            )}
        </View>
    );
};

MessageBubble.defaultProps = {
    myself: false,
};

MessageBubble.propTypes = {
    myself: PropTypes.bool.isRequired,
    roomID: PropTypes.string,
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
    }),
    attachedMessage: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['text', 'images', 'share_post', 'share_item', 'poll']).isRequired,
        message: PropTypes.string,
        images: PropTypes.array,
        created_at: PropTypes.object,
    }),
    openMessageActionDialog: PropTypes.func.isRequired,
    openMessageLikesDialog: PropTypes.func,
};

export default MessageBubble;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 12.5,
        paddingVertical: 7.5,
        borderRadius: 25,
    },
    myselfContainer: {
        backgroundColor: colors.LIGHT_PRIMARY_COLOR,
        borderBottomRightRadius: 0,
    },
    othersContainer: {
        backgroundColor: colors.GREY,
        borderBottomLeftRadius: 0,
    },
    name: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        color: colors.PRIMARY_COLOR,
        paddingBottom: 5,
    },
});
