import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import { connect } from 'react-redux';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import DoubleTap from 'react-native-double-tap';
import FastImage from 'react-native-fast-image';
import { deletePost } from '../../actions/feedActions';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import MoreOptionsSvg from '../../assets/Images/moreoptions.svg';
import { colors, fonts } from '../../constants';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import FirebaseErrors from '../../service/firebase_errors/';
import User from '../../service/firebase_requests/User';
import FeedCardTitle from './FeedCardTitle';
import FeedCardMedia from './FeedCardMedia';
import FeedCardDialog from './FeedCardDialog';
import FeedShareDialog from './FeedShareDialog';
import PrivateContentDialog from '../Dialogs/PrivateContentDialog';
import ReviewSection from './ReviewSection';
import AuthDialog from '../App/AuthDialog';
import FeedSkeleton from '../../components/Feed/FeedSkeleton';

const FeedCard = ({ data, navigation, user, addMilkBottle, setError, setLoading, deletePost, showReviewSection }) => {
    const settingRBSheetRef = useRef();
    const authorDialogRef = useRef();
    const shareDialogRef = useRef();
    const privateContentRef = useRef();
    const [author, setAuthor] = useState(null);

    // Get author data
    useEffect(() => {
        User.getUserById(data.author)
            .then(setAuthor)
            .catch((error) => FirebaseErrors.setError(error, setError));
    }, [data.author]);

    const openAuthDialog = () => {
        authorDialogRef.current.open && authorDialogRef.current.open();
    };

    const navigateToAuthor = () => {
        if (author.uid === user.uid) {
            return navigation && navigation.navigate(NAVIGATOR_CONSTANTS.PROFILE, { screen: NAVIGATOR_CONSTANTS.MY_PROFILE });
        } else {
            return navigation && navigation.push(NAVIGATOR_CONSTANTS.USER_PROFILE, { userID: author.uid });
        }
    };

    const navigateToPost = () => {
        switch (data.type) {
            case DATABASE_CONSTANTS.TIPS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.TIPS, { tipID: data.id });
            case DATABASE_CONSTANTS.QUESTIONS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.QUESTIONS, { questionID: data.id });
            case DATABASE_CONSTANTS.REVIEWS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.REVIEWS, { reviewID: data.id });
            default:
                return setError('Not yet implemented!');
        }
    };

    const upvoteThisPost = () => {
        FirebaseFeed.doubleTapUpvoteInFeed(data.id)
            .then(addMilkBottle)
            .catch((error) => FirebaseErrors.setError(error, setError));
    };

    const onDeletePost = () => {
        data && deletePost(data);
    };

    if (!author || !data) return <FeedSkeleton />;

    return (
        <View style={styles.container}>
            <View style={styles.topContainer}>
                <View style={styles.authorBar}>
                    <TouchableOpacity onPress={navigateToAuthor}>
                        <FastImage source={{ uri: author.avatar_url }} style={styles.avatar} />
                    </TouchableOpacity>

                    <View style={styles.authorNameBar}>
                        <Text numberOfLines={1} ellipsizeMode="clip" style={styles.authorName}>
                            {author.name}
                        </Text>
                        <Text style={styles.timestamp}>{moment(data?.created_at.toDate()).fromNow()}</Text>
                    </View>

                    <TouchableOpacity onPress={() => settingRBSheetRef.current.open && settingRBSheetRef.current.open()}>
                        <MoreOptionsSvg height={25} width={5} />
                    </TouchableOpacity>
                </View>

                <DoubleTap singleTap={navigateToPost} doubleTap={upvoteThisPost}>
                    <View>
                        <FeedCardTitle data={data} />
                    </View>
                </DoubleTap>
            </View>

            <FeedCardMedia
                navigation={navigation}
                data={data}
                singleTap={navigateToPost}
                doubleTap={upvoteThisPost}
                openAuthDialog={openAuthDialog}
                addMilkBottle={addMilkBottle}
                showReviewSection={showReviewSection}
            />

            {data.product && showReviewSection && (
                <View style={styles.reviewSection}>
                    <ReviewSection navigation={navigation} product={data.product} />
                </View>
            )}

            <FeedCardDialog
                forwardRef={settingRBSheetRef}
                shareDialogRef={shareDialogRef}
                data={data}
                navigation={navigation}
                setLoading={setLoading}
                setError={setError}
                onDeletePost={onDeletePost}
                openAuthDialog={openAuthDialog}
            />
            {author && privateContentRef && (
                <FeedShareDialog
                    forwardRef={shareDialogRef}
                    privateContentRef={privateContentRef}
                    data={data}
                    author={author}
                    navigation={navigation}
                    setError={setError}
                    openAuthDialog={openAuthDialog}
                />
            )}
            <PrivateContentDialog forwardRef={privateContentRef} />
            <AuthDialog authDialogRef={authorDialogRef} navigation={navigation} />
        </View>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {
    deletePost,
};

export default connect(mapStateToProps, mapDispatchToProps)(FeedCard);

FeedCard.defaultProps = {
    showReviewSection: true,
};

FeedCard.propTypes = {
    data: PropTypes.shape({
        id: PropTypes.string.isRequired,
        types: PropTypes.oneOf(['TIPS', 'REVIEWS', 'QUESTIONS']),
        author: PropTypes.string.isRequired,
        product: PropTypes.shape({
            asin: PropTypes.string,
        }),
        image_url: PropTypes.oneOfType([PropTypes.string, PropTypes.arrayOf(PropTypes.string)]),
        visibility: PropTypes.string,
        number_of_comments: PropTypes.number,
        vote: PropTypes.number,
        created_at: PropTypes.object.isRequired,
        product: PropTypes.shape({
            asin: PropTypes.string.isRequired,
            price: PropTypes.object,
            image: PropTypes.string,
            title: PropTypes.string.isRequired,
        }),
    }),
    navigation: PropTypes.object.isRequired,
    addMilkBottle: PropTypes.func,
    showReviewSection: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
    container: {
        borderColor: colors.GREY,
        borderWidth: 2,
        borderRadius: 25,
        marginBottom: 25,
    },
    topContainer: {
        padding: 25,
    },
    authorBar: {
        flexDirection: 'row',
        marginBottom: 25,
        alignItems: 'center',
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
    },
    authorNameBar: {
        flex: 1,
        justifyContent: 'space-between',
        marginLeft: 25,
        marginRight: 10,
    },
    authorName: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 18,
    },
    timestamp: {
        fontFamily: fonts.MULISH_LIGHT,
        fontSize: 16,
    },
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 20,
    },
    reviewSection: {
        margin: 20,
    },
});
