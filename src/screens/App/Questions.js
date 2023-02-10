import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, TouchableOpacity, TextInput, FlatList, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { deletePost } from '../../actions/feedActions';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import FirebaseErrors from '../../service/firebase_errors';
import User from '../../service/firebase_requests/User';
import GlobalStyles from '../../constants/globalStyles';
import { colors, fonts } from '../../constants';
import HeaderIcon from '../../components/App/HeaderIcon';
import SettingsIcon from '../../assets/Images/Profile/settings.svg';
import Toast from '../../components/Toast';
import LoadingDotsOverlay from '../../components/LoadingDotsOverlay';
import AuthorBar from '../../components/Feed/AuthorBar';
import AuthDialog from '../../components/App/AuthDialog';
import SendSvg from '../../assets/Images/send.svg';
import NoCommentBackground from '../../assets/Images/no_messages.png';
import Anonymous from '../../assets/Images/anonymous.svg';
import FeedsComment from '../../components/Feed/FeedsComment';
import FeedCardDialog from '../../components/Feed/FeedCardDialog';
import FeedShareDialog from '../../components/Feed/FeedShareDialog';
import PrivateContentDialog from '../../components/Dialogs/PrivateContentDialog';
import ReviewSection from '../../components/Feed/ReviewSection';

const Questions = ({ navigation, route, user, deletePost }) => {
    const questionID = route.params?.questionID || null;
    if (!questionID) {
        setTimeout(() => navigation.goBack(), 500);
        return <View />;
    }
    const toggleComment = route.params?.toggleComment || false;
    const [error, setError] = useState('');
    const [init, setInit] = useState(true);
    const [loading, setLoading] = useState(false);
    const [question, setQuestion] = useState(null);
    const [upvote, setUpvote] = useState([]);
    const [downvote, setDownvote] = useState([]);
    const [comments, setComments] = useState(null);
    const [author, setAuthor] = useState(null);
    const authDialogRef = useRef();
    const inputRef = useRef();
    const settingsDialogRef = useRef();
    const shareDialogRef = useRef();
    const privateContentRef = useRef();
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [newReply, setNewReply] = useState('');
    const [anonymous, setAnonymous] = useState(false);
    const insets = useSafeAreaInsets();

    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <HeaderIcon
                    onPress={() => settingsDialogRef.current && settingsDialogRef.current.open()}
                    style={{ width: 60, justifyContent: 'center' }}>
                    <SettingsIcon width={30} height={20} />
                </HeaderIcon>
            ),
        });
    }, [navigation, settingsDialogRef]);

    useEffect(() => {
        user?.uid && FirebaseFeed.updatePostViewer(questionID).catch((error) => FirebaseErrors.setError(error, setError));
    }, [user?.uid, questionID]);

    // Init status
    useEffect(() => {
        if (question?.id && author?.uid && Array.isArray(upvote) && Array.isArray(downvote)) {
            setInit(false);
            toggleComment && setTimeout(() => inputRef.current && inputRef.current.focus(), 500);
        } else {
            setInit(true);
        }
    }, [question, author]);

    // Question listener
    useEffect(() => {
        const onQuestion = (documentSnapshot) => {
            if (documentSnapshot.exists) {
                setQuestion({ id: documentSnapshot.id, ...documentSnapshot.data() });
            } else {
                setInit(true);
            }
        };
        const questionUnsubscribe = FirebaseFeed.retrieveFeed(questionID, onQuestion, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        const onUpvote = (querySnapshot) =>
            Array.isArray(querySnapshot?.docs) &&
            setUpvote(
                querySnapshot.docs.map((uv) => {
                    return { id: uv.id, ...uv.data() };
                }),
            );
        const upvoteUnsubscribe = FirebaseFeed.retrieveFeedUpvote(questionID, onUpvote, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        const onDownvote = (querySnapshot) =>
            Array.isArray(querySnapshot?.docs) &&
            setDownvote(
                querySnapshot.docs.map((dv) => {
                    return { id: dv.id, ...dv.data() };
                }),
            );
        const downvoteUnsubscribe = FirebaseFeed.retrieveFeedDownvote(questionID, onDownvote, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        return () => {
            questionUnsubscribe();
            upvoteUnsubscribe();
            downvoteUnsubscribe();
        };
    }, [questionID]);

    // Comments listener
    useEffect(() => {
        const next = (querySnapshot) => {
            setComments(
                querySnapshot.docs.map((c) => {
                    return { id: c.id, ...c.data() };
                }),
            );
        };
        const unsubscribe = FirebaseFeed.retrieveFeedComments(questionID, next, (error) =>
            FirebaseErrors.setError(error, setError),
        );

        return unsubscribe;
    }, [questionID]);

    // Get question's author
    useEffect(() => {
        if (question && question.author && typeof question.author === 'string') {
            User.getUserById(question.author)
                .then(setAuthor)
                .catch((error) => FirebaseErrors.setError(error, setError));
        }
    }, [question]);

    const openAuthDialog = () => {
        authDialogRef.current && authDialogRef.current.open();
    };

    const setAspectRatio = (evt) => {
        const maxHeight = 300;
        const maxWidth = Dimensions.get('window').width * 0.8;
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setWidth(evt.nativeEvent.width * ratio);
        setHeight(evt.nativeEvent.height * ratio);
    };

    const _inputDisabled = () => {
        return (newComment.length < 2 && newReply.length < 2) || loading;
    };

    const onReplyPress = (comment) => {
        setReplyTo(comment);
        setNewReply('');
        setNewComment('');
        setAnonymous(false);
    };

    const cancelReply = () => {
        setReplyTo(null);
        setNewReply('');
        setNewComment('');
        setAnonymous(false);
    };

    const onDeletePost = () => {
        question && deletePost(question);
        navigation.goBack();
    };

    const createCommentOrReply = () => {
        Keyboard.dismiss();
        if (replyTo && replyTo.id) {
            setLoading(true);
            return FirebaseFeed.createReplyInComment(questionID, replyTo.id, newReply, anonymous)
                .then(cancelReply)
                .catch((error) => {
                    return FirebaseErrors.setError(error, setError);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            return FirebaseFeed.createCommentInFeed(questionID, newComment, anonymous)
                .then(cancelReply)
                .catch((error) => {
                    return FirebaseErrors.setError(error, setError);
                })
                .finally(() => setLoading(false));
        }
    };

    if (init && error === '') return <View />;
    else {
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <LoadingDotsOverlay animation={loading} />
                <FlatList
                    data={comments}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                        <View style={{ backgroundColor: colors.GREY, paddingHorizontal: 20 }}>
                            <FeedsComment
                                navigation={navigation}
                                feed_id={questionID}
                                comment={item}
                                openAuthDialog={openAuthDialog}
                                onReplyPress={onReplyPress}
                            />
                        </View>
                    )}
                    ListHeaderComponent={
                        <React.Fragment>
                            {question && author && (
                                <View style={styles.authorBarContainer}>
                                    <AuthorBar
                                        feed={question}
                                        upvote={upvote}
                                        downvote={downvote}
                                        author={author}
                                        openAuthDialog={openAuthDialog}
                                        navigation={navigation}
                                        user={user}
                                    />
                                </View>
                            )}

                            {question?.product && (
                                <View style={styles.productContainer}>
                                    <ReviewSection navigation={navigation} product={question.product} />
                                </View>
                            )}

                            <Text style={styles.title}>{question.question}</Text>

                            {question?.image_url && (
                                <View style={styles.questionImageContainer}>
                                    <FastImage
                                        source={{ uri: question.image_url }}
                                        style={[styles.questionImage, { width, height }]}
                                        resizeMode={FastImage.resizeMode.contain}
                                        onLoad={setAspectRatio}
                                    />
                                </View>
                            )}

                            <View style={styles.commentContainer}>
                                <Text style={styles.commentTitle}>user responses</Text>
                            </View>
                        </React.Fragment>
                    }
                    ListEmptyComponent={
                        <View
                            style={{
                                width: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                                backgroundColor: colors.GREY,
                                height: Dimensions.get('window').height * 0.5,
                            }}>
                            <FastImage source={NoCommentBackground} resizeMode="contain" style={{ width: '100%', height: 300 }} />
                            <Text style={{ marginVertical: 20, fontFamily: fonts.MULISH_REGULAR, fontSize: 15 }}>
                                no responses yet
                            </Text>
                        </View>
                    }
                />

                {user && (
                    <View style={styles.inputBarContainer}>
                        {replyTo && (
                            <View style={styles.replyStatusContainer}>
                                <Text style={{ fontFamily: fonts.MULISH_REGULAR }}>
                                    replying to{' '}
                                    <Text style={{ fontFamily: fonts.MULISH_BOLD, fontSize: 14 }}>{replyTo?.author?.name}</Text>
                                </Text>
                                <TouchableOpacity style={styles.cancelReplyContainer} onPress={cancelReply}>
                                    <Ionicons name={'close-outline'} size={20} />
                                    <Text style={{ fontFamily: fonts.MULISH_REGULAR }}>cancel</Text>
                                </TouchableOpacity>
                            </View>
                        )}
                        <View style={styles.inputBar}>
                            <TouchableOpacity onPress={() => setAnonymous(!anonymous)}>
                                {anonymous ? (
                                    <Anonymous style={styles.anonymous} />
                                ) : (
                                    <FastImage
                                        source={{ uri: user.avatar_url }}
                                        style={styles.inputBarAvatar}
                                        resizeMode={FastImage.resizeMode.contain}
                                    />
                                )}
                            </TouchableOpacity>

                            <TextInput
                                ref={inputRef}
                                style={styles.input}
                                placeholder={replyTo ? `add a reply...` : 'add a response...'}
                                value={replyTo ? newReply : newComment}
                                onChangeText={replyTo ? setNewReply : setNewComment}
                            />
                            {!_inputDisabled() && (
                                <TouchableOpacity
                                    style={styles.sendIcon}
                                    disabled={_inputDisabled()}
                                    onPress={createCommentOrReply}>
                                    <SendSvg />
                                </TouchableOpacity>
                            )}
                        </View>
                    </View>
                )}
                <KeyboardSpacer topSpacing={-insets.bottom} />
                <AuthDialog authDialogRef={authDialogRef} navigation={navigation} />
                <FeedCardDialog
                    forwardRef={settingsDialogRef}
                    shareDialogRef={shareDialogRef}
                    navigation={navigation}
                    data={question}
                    setLoading={setLoading}
                    setError={setError}
                    onDeletePost={onDeletePost}
                    openAuthDialog={openAuthDialog}
                />
                {author && privateContentRef && (
                    <FeedShareDialog
                        forwardRef={shareDialogRef}
                        privateContentRef={privateContentRef}
                        data={question}
                        author={author}
                        navigation={navigation}
                        setError={setError}
                        openAuthDialog={openAuthDialog}
                    />
                )}
                <PrivateContentDialog forwardRef={privateContentRef} />
            </SafeAreaView>
        );
    }
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {
    deletePost,
};

export default connect(mapStateToProps, mapDispatchToProps)(Questions);

const styles = StyleSheet.create({
    productContainer: {
        borderWidth: 1,
        borderColor: colors.DARK_GREY,
        borderRadius: 25,
        padding: 10,
        margin: 20,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 30,
        paddingVertical: 15,
        paddingHorizontal: 20,
    },
    authorBarContainer: {
        paddingTop: 30,
        paddingHorizontal: 20,
    },
    questionImageContainer: {
        padding: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    questionImage: {
        borderRadius: 30,
    },
    commentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: colors.GREY,
        marginTop: 20,
    },
    commentTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        marginBottom: 20,
    },
    inputBarContainer: {
        borderTopWidth: 2,
        borderTopColor: colors.GREY,
    },
    replyStatusContainer: {
        flexDirection: 'row',
        width: '100%',
        marginVertical: 10,
        marginHorizontal: 15,
        alignItems: 'center',
    },
    cancelReplyContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FF5A61',
        marginLeft: 10,
        padding: 3,
        paddingRight: 6,
        borderRadius: 20,
    },
    inputBar: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
    },
    inputBarAvatar: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        margin: 15,
    },
    anonymous: {
        transform: [{ rotate: '180deg' }],
        width: 40,
        height: 40,
        margin: 15,
    },
    input: {
        flex: 1,
        height: 50,
        backgroundColor: colors.GREY,
        borderRadius: 20,
        marginVertical: 10,
        padding: 15,
        paddingRight: 45,
        marginRight: 20,
    },
    sendIcon: {
        position: 'absolute',
        right: 30,
    },
});
