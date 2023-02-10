import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { FEED, COMMENTS, REPLIES } from '../../service/database_constants';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import User from '../../service/firebase_requests/User';
import FirebaseErrors from '../../service/firebase_errors';
import { colors, fonts } from '../../constants';
import FeedsReply from './FeedsReply';
import Anonymous from '../../assets/Images/anonymous.svg';

const FeedsComment = ({ navigation, commentsRef, feed_id, comment, showReply, openAuthDialog, user, onReplyPress }) => {
    const [author, setAuthor] = useState(null);
    const [showAllReplies, setShowAllReplies] = useState(false);
    const [replies, setReplies] = useState([]);
    const [error, setError] = useState('');

    // Get comment's author
    useEffect(() => {
        comment?.author &&
            User.getUserById(comment.author)
                .then(setAuthor)
                .catch((error) => FirebaseErrors.setError(error, setError));
    }, [comment]);

    // Get Comment's replies
    useEffect(() => {
        const unsubscribe =
            comment?.id &&
            firestore()
                .collection(FEED)
                .doc(feed_id)
                .collection(COMMENTS)
                .doc(comment.id)
                .collection(REPLIES)
                .orderBy('created_at', 'asc')
                .onSnapshot((repliesQuerySnapshot) => {
                    if (repliesQuerySnapshot.empty) setReplies([]);
                    else
                        setReplies(
                            repliesQuerySnapshot.docs.map((r) => {
                                return { id: r.id, ...r.data() };
                            }),
                        );
                });

        return () => unsubscribe && unsubscribe();
    }, [comment]);

    const navigateToAuthor = () => {
        commentsRef && commentsRef.current && commentsRef.current.close();
        if (author.uid === user?.uid) {
            return navigation && navigation.navigate(NAVIGATOR_CONSTANTS.PROFILE, { screen: NAVIGATOR_CONSTANTS.MY_PROFILE });
        } else {
            return navigation && navigation.push(NAVIGATOR_CONSTANTS.USER_PROFILE, { userID: author.uid });
        }
    };

    if (error || !comment || !author) return null;

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                {comment.anonymous ? (
                    <Anonymous style={styles.anonymous} />
                ) : (
                    <TouchableOpacity onPress={navigateToAuthor}>
                        <Image source={{ uri: author.avatar_url }} style={styles.avatar} resizeMode="stretch" />
                    </TouchableOpacity>
                )}

                <View style={styles.commentContainer}>
                    <Text style={styles.comment}>
                        <Text style={styles.name}>{comment.anonymous ? 'anonymous' : `${author.name}`}</Text>
                        {` ${comment.comment}`}
                    </Text>

                    <View style={styles.timestampContainer}>
                        <Text style={styles.timestamp}>
                            {`${moment(comment.created_at.toDate()).fromNow()}`}{' '}
                            {moment(comment.created_at.toDate()).fromNow() !== 'now' && 'ago'}
                        </Text>
                        {user && onReplyPress && (
                            <TouchableOpacity onPress={() => onReplyPress({ ...comment, author })}>
                                <Text style={styles.reply}>Reply</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </View>
            </View>
            {showReply && replies.length > 0 && (
                <View style={styles.repliesContainer}>
                    <FeedsReply
                        navigation={navigation}
                        commentsRef={commentsRef}
                        feed_id={feed_id}
                        comment={{ ...comment, author }}
                        reply={replies[0]}
                        openAuthDialog={openAuthDialog}
                        onReplyPress={onReplyPress}
                    />

                    {showAllReplies && (
                        <FlatList
                            keyExtractor={(item) => item.id}
                            data={replies.slice(1, replies.length)}
                            renderItem={({ item }) => (
                                <FeedsReply
                                    navigation={navigation}
                                    commentsRef={commentsRef}
                                    feed_id={feed_id}
                                    comment={{ ...comment, author }}
                                    reply={item}
                                    openAuthDialog={openAuthDialog}
                                    onReplyPress={onReplyPress}
                                />
                            )}
                        />
                    )}

                    {replies.length > 1 && (
                        <TouchableOpacity
                            style={styles.showAllRepliesContainer}
                            onPress={() => setShowAllReplies(!showAllReplies)}>
                            <Text style={styles.showAllRepliesText}>
                                {showAllReplies ? `hide all replies` : `show replies (${comment.number_of_replies})`}
                            </Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        </View>
    );
};

FeedsComment.defaultProps = {
    showReply: true,
};

FeedsComment.propTypes = {
    navigation: PropTypes.object.isRequired,
    user: PropTypes.object,
    feed_id: PropTypes.string.isRequired,
    comment: PropTypes.shape({
        id: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
    }),
    showReply: PropTypes.bool.isRequired,
    openAuthDialog: PropTypes.func.isRequired,
    onReplyPress: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FeedsComment);

const styles = StyleSheet.create({
    container: {
        marginBottom: 20,
    },
    topContainer: {
        flexDirection: 'row',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        marginRight: 15,
    },
    anonymous: {
        transform: [{ rotate: '180deg' }],
        width: 40,
        height: 40,
        marginRight: 15,
    },
    commentContainer: {
        flex: 1,
    },
    comment: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    timestampContainer: {
        flexDirection: 'row',
        paddingTop: 15,
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: '#a2a2a2',
        paddingRight: 20,
    },
    reply: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    repliesContainer: {
        width: '90%',
        alignSelf: 'flex-end',
    },
    showAllRepliesContainer: {
        width: '90%',
        borderRadius: 20,
        marginTop: 15,
        paddingVertical: 15,
        alignSelf: 'center',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
    },
    showAllRepliesText: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 13,
        color: '#7c7c7c',
    },
});
