import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Dimensions, FlatList, TextInput, TouchableOpacity, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import firestore from '@react-native-firebase/firestore';
import { FEED, COMMENTS } from '../../constants/Database';
import { colors, fonts } from '../../constants';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import FirebaseErrors from '../../service/firebase_errors';
import FeedsComment from './FeedsComment';
import SendSvg from '../../assets/Images/send.svg';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import NoCommentBackground from '../../assets/Images/no_messages.png';

const { height } = Dimensions.get('window');

const FeedsCommentDialog = ({ commentsRef, toggleComment, openAuthDialog, navigation, feed_id, user, setError }) => {
    const [comments, setComments] = useState([]);
    const [loading, setLoading] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [replyTo, setReplyTo] = useState(null);
    const [newReply, setNewReply] = useState('');
    const insets = useSafeAreaInsets();
    const inputRef = useRef();

    useEffect(() => {
        const next = (commentsQuerySnapshot) => {
            if (commentsQuerySnapshot.empty) setComments([]);
            else {
                setComments(
                    commentsQuerySnapshot.docs.map((c) => {
                        return { id: c.id, ...c.data() };
                    }),
                );
            }
        };
        const unsubscribe = FirebaseFeed.retrieveFeedComments(feed_id, next, (error) => FirebaseErrors.setError(error, setError));
        return unsubscribe;
    }, [feed_id]);

    const _inputDisabled = () => {
        return (newComment.length < 2 && newReply.length < 2) || loading;
    };

    const onReplyPress = (comment) => {
        setReplyTo(comment);
        setNewReply('');
        setNewComment('');
        inputRef.current && inputRef.current.focus();
    };

    const cancelReply = () => {
        setReplyTo(null);
        setNewReply('');
        setNewComment('');
        inputRef.current && inputRef.current.blur();
    };

    const createCommentOrReply = () => {
        Keyboard.dismiss();
        if (replyTo && replyTo.id) {
            setLoading(true);
            return FirebaseFeed.createReplyInComment(feed_id, replyTo.id, newReply)
                .then(cancelReply)
                .catch((error) => {
                    console.log(error);
                    return FirebaseErrors.setError(error, setError);
                })
                .finally(() => setLoading(false));
        } else {
            setLoading(true);
            return FirebaseFeed.createCommentInFeed(feed_id, newComment)
                .then(cancelReply)
                .catch((error) => {
                    console.log(error);
                    return FirebaseErrors.setError(error, setError);
                })
                .finally(() => setLoading(false));
        }
    };

    return (
        <RBSheet
            ref={commentsRef}
            height={height * 0.88}
            animationType={'slide'}
            closeOnDragDown={true}
            dragFromTopOnly={true}
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <View style={[styles.dialog, { marginBottom: insets.bottom }]}>
                <Text style={styles.dialogTitle}>
                    {comments.length === 1 ? 'comment' : 'comments'}{' '}
                    <Text style={styles.dialogSubtitle}>{`(${comments.length})`}</Text>
                </Text>
                {Array.isArray(comments) && (
                    <FlatList
                        keyExtractor={(item) => item.id}
                        data={comments}
                        renderItem={({ item }) => (
                            <FeedsComment
                                commentsRef={commentsRef}
                                feed_id={feed_id}
                                navigation={navigation}
                                comment={item}
                                openAuthDialog={openAuthDialog}
                                onReplyPress={onReplyPress}
                            />
                        )}
                        contentContainerStyle={styles.commentsContentContainer}
                        ListEmptyComponent={
                            <View style={{ width: '100%', justifyContent: 'center', alignItems: 'center', marginTop: 20 }}>
                                <FastImage
                                    source={NoCommentBackground}
                                    resizeMode="contain"
                                    style={{ width: '100%', height: height * 0.3 }}
                                />
                                <Text style={{ marginVertical: 20, fontFamily: fonts.MULISH_REGULAR, fontSize: 15 }}>
                                    no messages yet
                                </Text>
                            </View>
                        }
                    />
                )}
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
                            <FastImage source={{ uri: user.avatar_url }} style={styles.inputBarAvatar} resizeMode="contain" />
                            <TextInput
                                autoFocus={toggleComment}
                                ref={inputRef}
                                style={styles.input}
                                placeholder={replyTo ? `add a reply...` : 'add a comment...'}
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

                <KeyboardSpacer topSpacing={-(height * 0.12 + insets.bottom)} />
            </View>
        </RBSheet>
    );
};

FeedsCommentDialog.propTypes = {
    feed_id: PropTypes.string.isRequired,
    navigation: PropTypes.object.isRequired,
    commentsRef: PropTypes.object.isRequired,
    openAuthDialog: PropTypes.func.isRequired,
    user: PropTypes.object,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(FeedsCommentDialog);

const styles = StyleSheet.create({
    dialogContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    dialog: {
        flex: 1,
        marginHorizontal: 20,
        width: '100%',
    },
    dialogTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 10,
    },
    dialogSubtitle: {
        fontFamily: fonts.NEWYORKLARGE_REGULAR,
        fontSize: 18,
    },
    commentsContentContainer: {
        paddingHorizontal: 20,
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
