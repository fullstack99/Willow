import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../../constants';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import UpvoteIcon from '../../assets/Images/upvote.svg';
import DownvoteIcon from '../../assets/Images/downvote.svg';
import Anonymous from '../../assets/Images/anonymous.svg';
import FirebaseFeed from '../../service/firebase_requests/Feed';

const AuthorBar = ({ author, feed, upvote, downvote, navigation, openAuthDialog, user }) => {
    const onUpvote = () => {
        if (!feed.id || !Array.isArray(upvote)) return;
        if (!user) return openAuthDialog();
        const upvoteID =
            upvote.findIndex(({ uid }) => user.uid === uid) !== -1
                ? upvote[upvote.findIndex(({ uid }) => user.uid === uid)].id
                : null;
        const downvoteID =
            downvote.findIndex(({ uid }) => user.uid === uid) !== -1
                ? downvote[downvote.findIndex(({ uid }) => user.uid === uid)].id
                : null;
        return FirebaseFeed.upvoteInFeed(feed.id, upvoteID, downvoteID);
    };

    const onDownvote = () => {
        if (!feed.id || !Array.isArray(downvote)) return;
        if (!user) return openAuthDialog();
        const upvoteID =
            upvote.findIndex(({ uid }) => user.uid === uid) !== -1
                ? upvote[upvote.findIndex(({ uid }) => user.uid === uid)].id
                : null;
        const downvoteID =
            downvote.findIndex(({ uid }) => user.uid === uid) !== -1
                ? downvote[downvote.findIndex(({ uid }) => user.uid === uid)].id
                : null;
        return FirebaseFeed.downvoteInFeed(feed.id, upvoteID, downvoteID);
    };

    const navigateToAuthor = () => {
        if (author?.uid === user?.uid) {
            return navigation && navigation.navigate(NAVIGATOR_CONSTANTS.PROFILE, { screen: NAVIGATOR_CONSTANTS.MY_PROFILE });
        } else {
            return navigation && navigation.push(NAVIGATOR_CONSTANTS.USER_PROFILE, { userID: author.uid });
        }
    };

    const voteStatus = () => {
        if (!Array.isArray(upvote) || !Array.isArray(downvote)) return true;
        return upvote.length - downvote.length >= 0;
    };

    const isUpvoted = () => {
        if (!Array.isArray(upvote) || !user?.uid) return false;
        return upvote.findIndex(({ uid }) => user.uid === uid) !== -1;
    };

    const isDownvoted = () => {
        if (!Array.isArray(downvote) || !user?.uid) return false;
        return downvote.findIndex(({ uid }) => user.uid === uid) !== -1;
    };

    if (!feed?.created_at || !Array.isArray(upvote) || !Array.isArray(downvote)) return null;

    return (
        <View style={styles.authorRowContainer}>
            {feed?.anonymous ? (
                <View style={styles.anonymousContainer}>
                    <Anonymous style={styles.anonymous} />
                </View>
            ) : (
                <TouchableOpacity onPress={navigateToAuthor}>
                    <FastImage source={{ uri: author.avatar_url }} style={styles.avatar} resizeMode="stretch" />
                </TouchableOpacity>
            )}
            <View style={styles.authorNameContainer}>
                {feed?.anonymous ? (
                    <Text style={styles.name}>anonymous</Text>
                ) : (
                    <Text style={styles.name}>{`${author.name}`}</Text>
                )}
                <Text style={styles.timestamp}>{moment(feed?.created_at.toDate()).format('ll')}</Text>
            </View>
            <View style={styles.votingContainer}>
                <TouchableOpacity onPress={onUpvote}>
                    <UpvoteIcon width={22} height={22} style={{ color: isUpvoted() ? colors.PRIMARY_COLOR : colors.GREY_4 }} />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.votes,
                        {
                            color: voteStatus() ? colors.BLACK : colors.GREY_4,
                        },
                    ]}>
                    {upvote.length - downvote.length}
                </Text>
                <TouchableOpacity onPress={onDownvote}>
                    <DownvoteIcon
                        width={22}
                        height={22}
                        style={{ color: isDownvoted() ? colors.PRIMARY_COLOR : colors.GREY_4 }}
                    />
                </TouchableOpacity>
            </View>
        </View>
    );
};

AuthorBar.propTypes = {
    feed: PropTypes.shape({
        id: PropTypes.string.isRequired,
        created_at: PropTypes.object.isRequired,
    }).isRequired,
    upvote: PropTypes.array.isRequired,
    downvote: PropTypes.array.isRequired,
    author: PropTypes.shape({
        avatar_url: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
    navigation: PropTypes.object.isRequired,
    openAuthDialog: PropTypes.func.isRequired,
    user: PropTypes.object,
};

export default AuthorBar;

const styles = StyleSheet.create({
    authorRowContainer: {
        flexDirection: 'row',
        backgroundColor: colors.WHITE,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    authorNameContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        marginLeft: 10,
    },
    anonymousContainer: {
        width: 50,
        height: 50,
    },
    anonymous: {
        transform: [{ rotate: '180deg' }],
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 18,
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: '#a2a2a2',
    },
    votingContainer: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 20,
        backgroundColor: colors.GREY,
    },
    votes: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 18,
    },
});
