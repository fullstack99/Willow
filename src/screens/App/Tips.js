import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, SafeAreaView, View, Platform, Dimensions, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import { deletePost } from '../../actions/feedActions';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import HTML from 'react-native-render-html';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import GlobalStyles from '../../constants/globalStyles';
import { colors, fonts } from '../../constants';
import User from '../../service/firebase_requests/User';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import FirebaseErrors from '../../service/firebase_errors';
import LoadingDotsOverlay from '../../components/LoadingDotsOverlay';
import Toast from '../../components/Toast';
import TipsHeader from '../../components/Tips/TipsHeader';
import AuthorBar from '../../components/Feed/AuthorBar';
import FeedsComment from '../../components/Feed/FeedsComment';
import AuthDialog from '../../components/App/AuthDialog';
import FeedCardDialog from '../../components/Feed/FeedCardDialog';
import FeedShareDialog from '../../components/Feed/FeedShareDialog';
import PrivateContentDialog from '../../components/Dialogs/PrivateContentDialog';
import FeedsCommentDialog from '../../components/Feed/FeedsCommentDialog';
import ReviewSection from '../../components/Feed/ReviewSection';

const { width, height } = Dimensions.get('window');
const MAX_HEIGHT = height * 0.35;
const MIN_HEIGHT = Platform.OS === 'ios' ? 120 : 55;

const Tips = ({ navigation, route, user, deletePost }) => {
    const tipID = route.params.tipID;
    if (!tipID) {
        setTimeout(() => navigation.goBack(), 500);
        return null;
    }
    const [loading, setLoading] = useState(false);
    const [toggleComment, setToggleComment] = useState(route.params.toggleComment || false);
    const [tip, setTip] = useState(null);
    const [upvote, setUpvote] = useState([]);
    const [downvote, setDownvote] = useState([]);
    const [author, setAuthor] = useState(null);
    const [tipsComment, setTipsComment] = useState(null);
    const [error, setError] = useState(!tipID ? 'missing tipID' : '');
    const authDialogRef = useRef();
    const commentsRef = useRef();
    const settingsRef = useRef();
    const shareDialogRef = useRef();
    const privateContentRef = useRef();
    const insets = useSafeAreaInsets();

    useEffect(() => {
        user?.uid && FirebaseFeed.updatePostViewer(tipID).catch((error) => FirebaseErrors.setError(error, setError));
    }, [user?.uid, tipID]);

    // Toggle Comment Dialog if necessary
    useEffect(() => {
        if (route.params.toggleComment && !loading) {
            commentsRef.current && !commentsRef.current.state.modalVisible && setTimeout(() => commentsRef.current.open(), 500);
            setTimeout(() => {
                setToggleComment(false);
            }, 2000);
        }
    }, [route.params, commentsRef.current, loading]);

    // Get Tip
    useEffect(() => {
        const onTip = (documentSnapshot) =>
            documentSnapshot?.id && setTip({ id: documentSnapshot.id, ...documentSnapshot.data() });
        const tipUnsubscribe = FirebaseFeed.retrieveFeed(tipID, onTip, (error) => FirebaseErrors.setError(error, setError));

        const onUpvote = (querySnapshot) =>
            Array.isArray(querySnapshot?.docs) &&
            setUpvote(
                querySnapshot.docs.map((uv) => {
                    return { id: uv.id, ...uv.data() };
                }),
            );
        const upvoteUnsubscribe = FirebaseFeed.retrieveFeedUpvote(tipID, onUpvote, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        const onDownvote = (querySnapshot) =>
            Array.isArray(querySnapshot?.docs) &&
            setDownvote(
                querySnapshot.docs.map((dv) => {
                    return { id: dv.id, ...dv.data() };
                }),
            );
        const downvoteUnsubscribe = FirebaseFeed.retrieveFeedDownvote(tipID, onDownvote, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        FirebaseFeed.getFeedsTopComment(tipID)
            .then(setTipsComment)
            .catch((error) => {
                console.error(error);
                FirebaseErrors.setError(error, setError);
            });

        return () => {
            tipUnsubscribe();
            upvoteUnsubscribe();
            downvoteUnsubscribe();
        };
    }, [tipID]);

    // Get Tip's author
    useEffect(() => {
        if (tip && tip.author) {
            User.getUserById(tip.author)
                .then(setAuthor)
                .catch((error) => FirebaseErrors.setError(error, setError));
        }
    }, [tip]);

    const goBack = () => {
        navigation && navigation.goBack();
    };
    const openAuthDialog = () => {
        if (commentsRef.current.state.modalVisible) {
            closeCommentsDialog();
            setTimeout(() => authDialogRef.current.open && authDialogRef.current.open(), 500);
        } else {
            authDialogRef.current.open && authDialogRef.current.open();
        }
    };
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

    const settingsOnPress = () => {
        settingsRef.current && settingsRef.current.open();
    };

    const onDeletePost = () => {
        deletePost(tip);
        navigation && navigation.goBack();
    };

    if (!tip || !author || !tipsComment || !Array.isArray(upvote) || !Array.isArray(downvote))
        return (
            <SafeAreaView style={GlobalStyles.alignCenterContainer}>
                <LoadingDotsOverlay animation />
            </SafeAreaView>
        );
    else
        return (
            <View style={GlobalStyles.container}>
                <View style={{ position: 'absolute', top: insets.top, zIndex: 999, alignItems: 'center', width: '100%' }}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <LoadingDotsOverlay animation={loading} />
                <ImageHeaderScrollView
                    maxHeight={MAX_HEIGHT}
                    minHeight={MIN_HEIGHT}
                    renderHeader={() => <FastImage source={{ uri: tip.image_url, cache: 'web' }} style={styles.image} />}
                    bounces
                    renderTouchableFixedForeground={() => <TipsHeader onPress={goBack} settingOnPress={settingsOnPress} />}>
                    <TriggeringView style={{ paddingBottom: 60 }}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>{tip.title}</Text>
                        </View>

                        {tip && author && (
                            <View style={styles.authorBarContainer}>
                                <AuthorBar
                                    feed={tip}
                                    upvote={upvote}
                                    downvote={downvote}
                                    author={author}
                                    navigation={navigation}
                                    openAuthDialog={openAuthDialog}
                                    user={user}
                                />
                            </View>
                        )}

                        {tip?.product && (
                            <View style={styles.productContainer}>
                                <ReviewSection navigation={navigation} product={tip.product} />
                            </View>
                        )}

                        <View style={styles.contentContainer}>
                            <HTML source={{ html: tip.content }} contentWidth={width} />
                        </View>

                        <View style={styles.commentContainer}>
                            <Text style={styles.commentTitle}>comments</Text>
                            {tip.number_of_comments > 0 && (
                                <FeedsComment
                                    navigation={navigation}
                                    feed_id={tip.id || route.params.tipID}
                                    comment={tipsComment[0]}
                                    showReply={false}
                                    openAuthDialog={openAuthDialog}
                                />
                            )}

                            {tip.number_of_comments === 0 && (
                                <TouchableOpacity style={styles.showAllCommentsButton} onPress={onAddCommentPress}>
                                    <Text style={styles.showAllCommentsText}>add comment</Text>
                                </TouchableOpacity>
                            )}

                            {tip.number_of_comments > 0 && (
                                <TouchableOpacity style={styles.showAllCommentsButton} onPress={onShowCommentPress}>
                                    <Text style={styles.showAllCommentsText}>{`show ${tip.number_of_comments} ${
                                        tip.number_of_comments === 1 ? 'comment' : 'comments'
                                    }`}</Text>
                                </TouchableOpacity>
                            )}
                        </View>
                    </TriggeringView>
                </ImageHeaderScrollView>

                <AuthDialog authDialogRef={authDialogRef} navigation={navigation} />
                <FeedCardDialog
                    forwardRef={settingsRef}
                    shareDialogRef={shareDialogRef}
                    navigation={navigation}
                    data={tip}
                    setLoading={setLoading}
                    setError={setError}
                    onDeletePost={onDeletePost}
                    openAuthDialog={openAuthDialog}
                />
                {author && privateContentRef && (
                    <FeedShareDialog
                        forwardRef={shareDialogRef}
                        privateContentRef={privateContentRef}
                        data={tip}
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
                    feed_id={tipID}
                    setError={setError}
                />
            </View>
        );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {
    deletePost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Tips);

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    image: {
        height: MAX_HEIGHT,
        width: width,
        resizeMode: 'cover',
    },
    titleContainer: {
        marginVertical: 30,
        marginLeft: 20,
        marginRight: 35,
    },
    title: {
        fontSize: 30,
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
    },
    authorBarContainer: {
        paddingHorizontal: 20,
    },
    productContainer: {
        borderWidth: 1,
        borderColor: colors.DARK_GREY,
        borderRadius: 25,
        padding: 10,
        margin: 20,
    },
    contentContainer: {
        padding: 20,
        backgroundColor: colors.WHITE,
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
