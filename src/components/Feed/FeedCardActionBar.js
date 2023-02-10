import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import UpvoteSvg from '../../assets/Images/upvote.svg';
import DownvoteSvg from '../../assets/Images/downvote.svg';
import CommentSvg from '../../assets/Images/comment.svg';
import ShareSvg from '../../assets/Images/share.svg';
import { colors, fonts } from '../../constants';

const FeedCardActionBar = ({ data, navigation, openAuthDialog, user, addMilkBottle, hasImage }) => {
    const [loading, setLoading] = useState(false);
    const [upvote, setUpvote] = useState([]);
    const [downvote, setDownvote] = useState([]);

    useEffect(() => {
        const unsubscribe = FirebaseFeed.retrieveFeedUpvote(data.id, (querySnapshot) => {
            setUpvote(
                querySnapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                }),
            );
        });

        return unsubscribe;
    }, [data.id]);

    useEffect(() => {
        const unsubscribe = FirebaseFeed.retrieveFeedDownvote(data.id, (querySnapshot) => {
            setDownvote(
                querySnapshot.docs.map((doc) => {
                    return { id: doc.id, ...doc.data() };
                }),
            );
        });

        return unsubscribe;
    }, [data.id]);

    const commentOnPress = () => {
        switch (data.type) {
            case DATABASE_CONSTANTS.TIPS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.TIPS, { tipID: data.id, toggleComment: true });
            case DATABASE_CONSTANTS.QUESTIONS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.QUESTIONS, { questionID: data.id, toggleComment: true });
            case DATABASE_CONSTANTS.REVIEWS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.REVIEWS, { reviewID: data.id, toggleComment: true });
            default:
                return;
        }
    };
    const shareOnPress = () => {
        if (!user) openAuthDialog();
        else return;
    };
    const upvoteOnPress = () => {
        if (!data.id) return;
        if (!user) return openAuthDialog();

        setLoading(true);
        const upvoteID =
            upvote.findIndex(({ uid }) => user.uid === uid) !== -1
                ? upvote[upvote.findIndex(({ uid }) => user.uid === uid)].id
                : null;
        const downvoteID =
            downvote.findIndex(({ uid }) => user.uid === uid) !== -1
                ? downvote[downvote.findIndex(({ uid }) => user.uid === uid)].id
                : null;

        !upvoteID && addMilkBottle && addMilkBottle();
        return FirebaseFeed.upvoteInFeed(data.id, upvoteID, downvoteID).finally(() => setTimeout(() => setLoading(false), 1000));
    };
    const downvoteOnPress = () => {
        if (!data.id) return;
        if (!user) return openAuthDialog();
        setLoading(true);
        const upvoteID =
            upvote.findIndex(({ uid }) => user.uid === uid) !== -1
                ? upvote[upvote.findIndex(({ uid }) => user.uid === uid)].id
                : null;
        const downvoteID =
            downvote.findIndex(({ uid }) => user.uid === uid) !== -1
                ? downvote[downvote.findIndex(({ uid }) => user.uid === uid)].id
                : null;
        return FirebaseFeed.downvoteInFeed(data.id, upvoteID, downvoteID).finally(() =>
            setTimeout(() => setLoading(false), 1000),
        );
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

    return (
        <View pointerEvents="auto" style={hasImage ? styles.hasImageContainer : styles.noImageContainer}>
            <View
                style={[
                    styles.overlayBox,
                    styles.upvoteContainer,
                    {
                        backgroundColor: hasImage ? colors.WHITE : colors.GREY,
                    },
                ]}>
                <TouchableOpacity style={styles.voteIcon} disabled={loading} onPress={upvoteOnPress}>
                    <UpvoteSvg style={{ color: isUpvoted() ? colors.PRIMARY_COLOR : colors.GREY_4 }} width={15} height={20} />
                </TouchableOpacity>
                <Text
                    style={[
                        styles.numberFont,
                        {
                            color: voteStatus() ? colors.BLACK : colors.GREY_4,
                        },
                    ]}>
                    {upvote.length - downvote.length}
                </Text>
                <TouchableOpacity style={styles.voteIcon} disabled={loading} onPress={downvoteOnPress}>
                    <DownvoteSvg style={{ color: isDownvoted() ? colors.PRIMARY_COLOR : colors.GREY_4 }} width={15} height={20} />
                </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={[
                    styles.overlayBox,
                    styles.commentContainer,
                    {
                        backgroundColor: hasImage ? colors.WHITE : colors.GREY,
                    },
                ]}
                onPress={commentOnPress}>
                <CommentSvg width={25} height={25} />
                <Text style={[styles.numberFont, { paddingLeft: 8 }]}>{data.number_of_comments}</Text>
            </TouchableOpacity>

            {/* <TouchableOpacity
                style={[
                    styles.overlayBox,
                    styles.shareContainer,
                    {
                        backgroundColor: hasImage ? colors.WHITE : colors.GREY,
                    },
                ]}
                onPress={shareOnPress}>
                <ShareSvg width={25} height={25} />
            </TouchableOpacity> */}
        </View>
    );
};

FeedCardActionBar.propTypes = {
    data: PropTypes.object.isRequired,
    user: PropTypes.shape({ uid: PropTypes.string.isRequired }),
    openAuthDialog: PropTypes.func.isRequired,
    addMilkBottle: PropTypes.func,
    hasImage: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FeedCardActionBar);

const styles = StyleSheet.create({
    hasImageContainer: {
        position: 'absolute',
        bottom: 20,
        width: '100%',
        flexDirection: 'row',
        zIndex: 100,
    },
    noImageContainer: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 20,
    },
    overlayBox: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 15,
        paddingVertical: 10,
    },
    upvoteContainer: {
        marginLeft: 15,
    },
    voteIcon: {
        paddingHorizontal: 10,
    },
    numberFont: {
        textAlign: 'center',
        minWidth: 20,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 18,
    },
    commentContainer: {
        paddingHorizontal: 15,
        marginHorizontal: 15,
    },
    shareContainer: {
        position: 'absolute',
        height: '100%',
        right: 15,
        paddingHorizontal: 15,
    },
});
