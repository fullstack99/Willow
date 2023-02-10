import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../../constants';
import * as DATABASE_CONSTANTS from '../../../constants/Database';
import * as NAVIGATOR_CONSTANTS from '../../../navigator/constants';
import CustomFastImage from '../../App/CustomFastImage';
import FirebaseChat from '../../../service/firebase_requests/Chat';
import FirebaseFeed from '../../../service/firebase_requests/Feed';
import FirebaseUser from '../../../service/firebase_requests/User';
import MultipleTouchable from '../../MultipleTouchable';
import MessageLikes from './MessageLikes';
import UnavailableContent from './UnavailableContent';
import SharedPostSkeleton from '../Skeleton/SharedPostSkeleton';

const SharedPost = ({
    navigation,
    postID,
    myself,
    room,
    message,
    messageUser,
    openMessageActionDialog,
    openMessageLikesDialog,
}) => {
    const user = useSelector((state) => state.auth.user);
    const [init, setInit] = useState(false);
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        if (postID) {
            FirebaseFeed.getFeedByID(postID)
                .then(setPost)
                .catch(console.log)
                .finally(() => setInit(true));
        }
    }, [postID]);

    useEffect(() => {
        if (post?.author && !post?.image_url) {
            FirebaseUser.getUserById(post.author).then(setAuthor).catch(console.log);
        }
    }, [post?.author, post?.image_url]);

    const _navigateToPost = () => {
        if (!post) return null;
        switch (post.type) {
            case DATABASE_CONSTANTS.TIPS:
                return (
                    navigation &&
                    navigation.navigate(NAVIGATOR_CONSTANTS.FEED, {
                        screen: NAVIGATOR_CONSTANTS.TIPS,
                        initial: false,
                        params: { tipID: postID },
                    })
                );
            case DATABASE_CONSTANTS.REVIEWS:
                return (
                    navigation &&
                    navigation.navigate(NAVIGATOR_CONSTANTS.FEED, {
                        screen: NAVIGATOR_CONSTANTS.REVIEWS,
                        initial: false,
                        params: { reviewID: postID },
                    })
                );
            case DATABASE_CONSTANTS.QUESTIONS:
                return (
                    navigation &&
                    navigation.navigate(NAVIGATOR_CONSTANTS.FEED, {
                        screen: NAVIGATOR_CONSTANTS.QUESTIONS,
                        initial: false,
                        params: { questionID: postID },
                    })
                );
            default:
                return;
        }
    };

    const onDoubleTap = () => {
        if (!room.id || !message || !message.id || !Array.isArray(message.likes) || message.user === user?.uid) return;
        FirebaseChat.likeMessage(room.id, message.id, message.likes.indexOf(user?.uid) === -1);
    };

    if (!init) return <SharedPostSkeleton />;

    if (init && !post) return <UnavailableContent myself={myself} message={`this shared post is no longer available`} />;

    return (
        <View>
            <MessageLikes myself={myself} type={room.type} message={message} openMessageLikesDialog={openMessageLikesDialog} />
            <MultipleTouchable
                onSingleTap={_navigateToPost}
                onDoubleTap={onDoubleTap}
                onLongPress={() => openMessageActionDialog(message)}>
                <View style={styles.container}>
                    {!post.image_url && author && (
                        <View style={styles.authorBarContainer}>
                            <CustomFastImage
                                source={{ uri: author.avatar_url }}
                                borderRadius={40 / 2}
                                maxHeight={40}
                                maxWidth={40}
                            />
                            <Text style={styles.authorName}>{author.name}</Text>
                        </View>
                    )}
                    {post.image_url && (
                        <View style={styles.top}>
                            <CustomFastImage
                                maxHeight={Dimensions.get('window').height}
                                maxWidth={Dimensions.get('window').width * 0.5}
                                source={{ uri: post.image_url }}
                                imageStyle={{ borderTopRightRadius: 25, borderTopLeftRadius: 25 }}
                            />
                        </View>
                    )}
                    <View style={styles.bottom}>
                        <Text style={styles.postTitle}>{post.title || post.question}</Text>
                    </View>
                </View>
            </MultipleTouchable>
        </View>
    );
};

SharedPost.defaultProps = {
    myself: false,
};

SharedPost.propTypes = {
    navigation: PropTypes.object.isRequired,
    postID: PropTypes.string.isRequired,
    myself: PropTypes.bool.isRequired,
    room: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.oneOf(['direct_message', 'private_group', 'public_forum']),
    }).isRequired,
    message: PropTypes.object,
    messageUser: PropTypes.object,
    openMessageActionDialog: PropTypes.func,
    openMessageLikesDialog: PropTypes.func,
};

export default SharedPost;

const styles = StyleSheet.create({
    container: {
        borderRadius: 25,
        borderWidth: 1,
        borderColor: colors.GREY,
    },
    top: {},
    bottom: {
        padding: 10,
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        maxWidth: Dimensions.get('window').width * 0.5,
    },
    postTitle: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 16,
    },
    authorBarContainer: {
        maxWidth: Dimensions.get('window').width * 0.5,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        paddingTop: 10,
    },
    authorName: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
        paddingHorizontal: 10,
    },
});
