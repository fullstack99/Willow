import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import moment from 'moment';
import User from '../../service/firebase_requests/User';
import FirebaseErrors from '../../service/firebase_errors';
import { colors, fonts } from '../../constants';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import Anonymous from '../../assets/Images/anonymous.svg';

const FeedsReply = ({ navigation, commentsRef, user, comment, reply, onReplyPress }) => {
    const [author, setAuthor] = useState(null);
    const [error, setError] = useState('');

    // Get Reply's author
    useEffect(() => {
        reply?.author &&
            User.getUserById(reply.author)
                .then(setAuthor)
                .catch((error) => FirebaseErrors.setError(error, setError));
    }, [reply]);

    const navigateToAuthor = () => {
        commentsRef && commentsRef.current && commentsRef.current.close();
        if (author.uid === user?.uid) {
            return navigation && navigation.navigate(NAVIGATOR_CONSTANTS.PROFILE, { screen: NAVIGATOR_CONSTANTS.MY_PROFILE });
        } else {
            return navigation && navigation.push(NAVIGATOR_CONSTANTS.USER_PROFILE, { userID: author.uid });
        }
    };

    if (!author || error) return null;

    return (
        <View style={styles.container}>
            {reply.anonymous ? (
                <Anonymous style={styles.anonymous} />
            ) : (
                <TouchableOpacity onPress={navigateToAuthor}>
                    <FastImage source={{ uri: author.avatar_url }} resizeMode="stretch" style={styles.avatar} />
                </TouchableOpacity>
            )}
            <View style={styles.commentContainer}>
                <Text style={styles.comment}>
                    <Text style={styles.name}>{reply.anonymous ? 'anonymous' : `${author.name}`}</Text>
                    {` ${reply.reply}`}
                </Text>

                {user && (
                    <View style={styles.timestampContainer}>
                        <Text style={styles.timestamp}>
                            {`${moment(reply.created_at.toDate()).fromNow()}`}{' '}
                            {moment(reply.created_at.toDate()).fromNow() !== 'now' && 'ago'}
                        </Text>
                        <TouchableOpacity onPress={() => onReplyPress({ ...comment, author })}>
                            <Text style={styles.reply}>Reply</Text>
                        </TouchableOpacity>
                    </View>
                )}
            </View>
        </View>
    );
};

FeedsReply.propTypes = {
    navigation: PropTypes.object.isRequired,
    user: PropTypes.object,
    feed_id: PropTypes.string.isRequired,
    comment: PropTypes.shape({
        id: PropTypes.string.isRequired,
        author: PropTypes.object.isRequired,
    }).isRequired,
    reply: PropTypes.shape({
        id: PropTypes.string.isRequired,
        author: PropTypes.string.isRequired,
    }).isRequired,
    onReplyPress: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FeedsReply);

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 20,
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
});
