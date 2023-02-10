import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList, Dimensions, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Carousel, { Pagination } from 'react-native-snap-carousel';
import FastImage from 'react-native-fast-image';
import { deletePost } from '../../../actions/feedActions';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import FirebaseFeed from '../../../service/firebase_requests/Feed';
import FirebaseErrors from '../../../service/firebase_errors/';
import User from '../../../service/firebase_requests/User';
import SettingsIcon from '../../../assets/Images/Profile/settings.svg';
import HeaderIcon from '../../../components/App/HeaderIcon';
import Toast from '../../../components/Toast';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import AuthorBar from '../../../components/Feed/AuthorBar';
import AuthDialog from '../../../components/App/AuthDialog';
import ReviewCarouselImage from './ReviewCarouselImage';
import ReviewSection from '../../../components/Feed/ReviewSection';
import ScoringBar from '../../../components/Product/ScoringBar';
import FeedCardDialog from '../../../components/Feed/FeedCardDialog';
import FeedShareDialog from '../../../components/Feed/FeedShareDialog';
import PrivateContentDialog from '../../../components/Dialogs/PrivateContentDialog';
import FeedsCommentDialog from '../../../components/Feed/FeedsCommentDialog';
import FeedsComment from '../../../components/Feed/FeedsComment';

const { width, height } = Dimensions.get('window');

const Reviews = ({ navigation, route }) => {
    const reviewID = route.params.reviewID || null;
    if (!reviewID) {
        setTimeout(() => navigation.goBack(), 500);
        return null;
    }
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [review, setReview] = useState(null);
    const [reviewTopComments, setReviewTopComments] = useState(null);
    const [upvote, setUpvote] = useState([]);
    const [downvote, setDownvote] = useState([]);
    const [author, setAuthor] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [activeSlide, setActiveSlide] = useState(0);
    const [toggleComment, setToggleComment] = useState(route.params.toggleComment || false);

    const carouselRef = useRef();
    const authDialogRef = useRef();
    const settingsRef = useRef();
    const shareDialogRef = useRef();
    const privateContentRef = useRef();
    const commentsRef = useRef();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'review',
            headerRight: () => (
                <HeaderIcon style={{ width: 60, justifyContent: 'center' }} onPress={openSettingsDialog}>
                    <SettingsIcon width={30} height={20} />
                </HeaderIcon>
            ),
        });
    }, [navigation]);

    // Get review
    useEffect(() => {
        const onReview = (documentSnapshot) => {
            if (documentSnapshot.exists) {
                setReview({ id: documentSnapshot.id, ...documentSnapshot.data() });
            } else {
                upvoteUnsubscribe && upvoteUnsubscribe();
                downvoteUnsubscribe && downvoteUnsubscribe();
                setReview(null);
            }
        };
        const reviewUnsubscribe = FirebaseFeed.retrieveFeed(reviewID, onReview, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        const onUpvote = (querySnapshot) =>
            Array.isArray(querySnapshot?.docs) &&
            setUpvote(
                querySnapshot.docs.map((uv) => {
                    return { id: uv.id, ...uv.data() };
                }),
            );
        const upvoteUnsubscribe = FirebaseFeed.retrieveFeedUpvote(reviewID, onUpvote, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        const onDownvote = (querySnapshot) =>
            Array.isArray(querySnapshot?.docs) &&
            setDownvote(
                querySnapshot.docs.map((dv) => {
                    return { id: dv.id, ...dv.data() };
                }),
            );
        const downvoteUnsubscribe = FirebaseFeed.retrieveFeedDownvote(reviewID, onDownvote, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        FirebaseFeed.getFeedsTopComment(reviewID)
            .then(setReviewTopComments)
            .catch((error) => FirebaseErrors.setError(error, setError));

        return () => {
            reviewUnsubscribe();
            upvoteUnsubscribe();
            downvoteUnsubscribe();
        };
    }, [reviewID]);

    // Track user's visit
    useEffect(() => {
        user?.uid && FirebaseFeed.updatePostViewer(reviewID).catch((error) => FirebaseErrors.setError(error, setError));
    }, [user?.uid, reviewID]);

    // Get review's author
    useEffect(() => {
        if (review && review.author && typeof review.author === 'string') {
            User.getUserById(review.author)
                .then(setAuthor)
                .catch((error) => FirebaseErrors.setError(error, setError));
        }
    }, [review]);

    // Toggle Comment Dialog if necessary
    useEffect(() => {
        if (route.params.toggleComment && !loading) {
            commentsRef.current && !commentsRef.current.state.modalVisible && setTimeout(() => commentsRef.current.open(), 500);
            setTimeout(() => {
                setToggleComment(false);
            }, 2000);
        }
    }, [route.params, commentsRef.current, loading]);

    const openAuthDialog = () => authDialogRef.current && authDialogRef.current.open();
    const openSettingsDialog = () => settingsRef.current && settingsRef.current.open();
    const openCommentsDialog = () => commentsRef.current.open && commentsRef.current.open();
    const closeCommentsDialog = () => commentsRef.current.close && commentsRef.current.close();

    const onShowCommentPress = () => {
        setToggleComment(false);
        return openCommentsDialog();
    };

    const onAddCommentPress = () => {
        if (!user) return openAuthDialog();
        else {
            setToggleComment(true);
            return openCommentsDialog();
        }
    };

    const onDeletePost = () => {
        dispatch(deletePost(review));
        return navigation.goBack();
    };

    if (!review || !author || !Array.isArray(reviewTopComments) || !Array.isArray(upvote) || !Array.isArray(downvote) || error)
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <LoadingDotsOverlay animation />
            </SafeAreaView>
        );

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <ScrollView>
                <View style={styles.contentContainer}>
                    <Text style={styles.title}>{review?.title}</Text>

                    <AuthorBar
                        navigation={navigation}
                        author={author}
                        feed={review}
                        upvote={upvote}
                        downvote={downvote}
                        openAuthDialog={openAuthDialog}
                        user={user}
                    />

                    {Array.isArray(review?.image_url) && review.image_url.length > 0 ? (
                        <View style={styles.productCardContainer}>
                            <Carousel
                                ref={carouselRef}
                                data={review.image_url}
                                renderItem={({ item }) => <ReviewCarouselImage uri={item} />}
                                onSnapToItem={setActiveSlide}
                                itemWidth={width - 40}
                                sliderWidth={width - 40}
                                containerCustomStyle={{ flexGrow: 0 }}
                                slideStyle={styles.slideStyle}
                            />
                            <Pagination
                                carouselRef={carouselRef}
                                dotsLength={review.image_url.length}
                                activeDotIndex={activeSlide}
                                containerStyle={styles.paginationContainer}
                                dotColor={colors.PRIMARY_COLOR}
                                dotStyle={styles.paginationDot}
                                inactiveDotColor={colors.LIGHT_PRIMARY_COLOR}
                            />
                            {review?.product && (
                                <View style={styles.productContainer}>
                                    <ReviewSection navigation={navigation} product={review.product} />
                                </View>
                            )}
                        </View>
                    ) : (
                        review?.product && (
                            <View style={styles.productCardContainer}>
                                <View style={[styles.productContainer, { borderRadius: 20, borderTopWidth: 1 }]}>
                                    <ReviewSection navigation={navigation} product={review.product} />
                                </View>
                            </View>
                        )
                    )}

                    <View style={styles.productInfoContainer}>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitle}>pros:</Text>
                            <Text style={styles.info}>{review?.benefit}</Text>
                        </View>
                        <View style={styles.infoContainer}>
                            <Text style={styles.infoTitle}>cons:</Text>
                            <Text style={styles.info}>{review?.defect}</Text>
                        </View>
                        <ScoringBar title="easy of use" score={review?.easy_of_use} />
                        <ScoringBar title="design" score={review?.design} />
                        <ScoringBar title="build quality" score={review?.build_quality} />
                    </View>
                </View>

                <View style={styles.commentContainer}>
                    <Text style={styles.commentTitle}>comments</Text>
                    {reviewTopComments.length > 0 && (
                        <FeedsComment
                            navigation={navigation}
                            feed_id={reviewID}
                            comment={reviewTopComments[0]}
                            showReply={false}
                            openAuthDialog={openAuthDialog}
                        />
                    )}

                    {reviewTopComments.length === 0 && review.number_of_comments === 0 && (
                        <TouchableOpacity style={styles.showAllCommentsButton} onPress={onAddCommentPress}>
                            <Text style={styles.showAllCommentsText}>add comment</Text>
                        </TouchableOpacity>
                    )}

                    {review.number_of_comments > 0 && (
                        <TouchableOpacity style={styles.showAllCommentsButton} onPress={onShowCommentPress}>
                            <Text style={styles.showAllCommentsText}>{`show ${review.number_of_comments} ${
                                review.number_of_comments === 1 ? 'comment' : 'comments'
                            }`}</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </ScrollView>

            <AuthDialog authDialogRef={authDialogRef} navigation={navigation} />
            <FeedCardDialog
                forwardRef={settingsRef}
                shareDialogRef={shareDialogRef}
                navigation={navigation}
                data={review}
                setLoading={setLoading}
                setError={setError}
                onDeletePost={onDeletePost}
                openAuthDialog={openAuthDialog}
            />
            {author && privateContentRef && (
                <FeedShareDialog
                    forwardRef={shareDialogRef}
                    privateContentRef={privateContentRef}
                    data={review}
                    author={author}
                    navigation={navigation}
                    setError={setError}
                    openAuthDialog={openAuthDialog}
                />
            )}
            <PrivateContentDialog forwardRef={privateContentRef} />
            <FeedsCommentDialog
                commentsRef={commentsRef}
                toggleComment={toggleComment}
                navigation={navigation}
                openAuthDialog={openAuthDialog}
                feed_id={reviewID}
                setError={setError}
            />
        </SafeAreaView>
    );
};

export default Reviews;

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
    },
    contentContainer: {
        margin: 20,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 30,
        paddingBottom: 20,
    },
    productCardContainer: {
        marginVertical: 20,
    },
    slideStyle: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    paginationContainer: {
        position: 'absolute',
        bottom: 150,
        alignSelf: 'center',
        paddingHorizontal: 0,
        paddingVertical: 0,
    },
    paginationDot: {
        width: 10,
        height: 10,
        borderRadius: 5,
    },
    productContainer: {
        borderColor: colors.DARK_GREY,
        borderWidth: 1,
        borderTopWidth: 0,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        padding: 15,
    },
    productInfoContainer: {
        marginVertical: 20,
    },
    infoContainer: {
        marginBottom: 20,
    },
    infoTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        paddingBottom: 10,
    },
    info: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
    commentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: colors.GREY,
    },
    commentTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        marginBottom: 20,
    },
    showAllCommentsButton: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        borderRadius: 20,
        paddingVertical: 15,
    },
    showAllCommentsText: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 13,
        color: '#7c7c7c',
    },
});
