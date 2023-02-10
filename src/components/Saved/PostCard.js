import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import SavedSkeleton from './SavedSkeleton';
import CheckmarkIcon from '../../assets/Images/Saved/checkmark.svg';
import FirebaseErrors from '../../service/firebase_errors';
import User from '../../service/firebase_requests/User';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import { colors, fonts } from '../../constants';

const PostCard = ({
    documentReference,
    bookmarkReference,
    setError,
    chosen,
    selectMode,
    onSelectPost,
    navigateToPost,
    setSelectMode,
}) => {
    const [post, setPost] = useState(null);
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        typeof documentReference.get === 'function' &&
            documentReference
                .get()
                .then((documentSnapshot) => {
                    setPost({ id: documentSnapshot.id, ...documentSnapshot.data() });
                    User.getUserById(documentSnapshot.data().author)
                        .then(setAuthor)
                        .catch((error) => FirebaseErrors.setError(error, setError));
                })
                .catch((error) => FirebaseErrors.setError(error, setError));
    }, [documentReference]);

    const onPress = () => {
        selectMode ? onSelectPost(bookmarkReference) : navigateToPost(post);
    };

    const onLongPress = () => {
        setSelectMode(true);
        onSelectPost(bookmarkReference);
    };

    if (!post || !author) return <SavedSkeleton />;
    else {
        const timestamp = post?.created_at?.toDate
            ? post.created_at.toDate()
            : new firestore.Timestamp(post.created_at._seconds, post.created_at._nanoseconds);

        switch (post.type) {
            case DATABASE_CONSTANTS.TIPS:
            case DATABASE_CONSTANTS.REVIEWS:
                return (
                    <TouchableOpacity style={styles.container} onPress={onPress} onLongPress={onLongPress}>
                        {chosen && <CheckmarkIcon style={styles.checkmark} />}
                        <FastImage
                            resizeMode={FastImage.resizeMode.cover}
                            style={chosen ? styles.chosenImage : styles.image}
                            source={{
                                uri:
                                    typeof post.image_url === 'string'
                                        ? post.image_url
                                        : Array.isArray(post.image_url) && post.image_url.length > 0
                                        ? post.image_url[0]
                                        : post?.product?.image,
                            }}
                        />
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
                            {post.title}
                        </Text>
                    </TouchableOpacity>
                );
            case DATABASE_CONSTANTS.QUESTIONS:
                return (
                    <TouchableOpacity style={styles.questionContainer} onPress={onPress} onLongPress={onLongPress}>
                        {chosen && <CheckmarkIcon style={styles.questionsCheckmark} />}
                        <View style={styles.authorBarContainer}>
                            <FastImage
                                source={{ uri: author.avatar_url }}
                                resizeMode={FastImage.resizeMode.contain}
                                style={styles.avatar}
                            />
                            <View>
                                <Text style={styles.name}>{author.name}</Text>
                                <Text style={styles.timestamp}>
                                    {`${moment(timestamp.toDate()).fromNow()}`}{' '}
                                    {moment(timestamp.toDate()).fromNow() !== 'now' && 'ago'}
                                </Text>
                            </View>
                        </View>
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.question}>
                            {post.question}
                        </Text>
                        {post.image_url && (
                            <FastImage
                                resizeMode={FastImage.resizeMode.cover}
                                style={[styles.image, { height: 250 }]}
                                source={{ uri: post.image_url }}
                            />
                        )}
                    </TouchableOpacity>
                );
            default:
                return null;
        }
    }
};

PostCard.propTypes = {
    documentReference: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    bookmarkReference: PropTypes.shape({
        id: PropTypes.string.isRequired,
    }).isRequired,
    setError: PropTypes.func.isRequired,
    chosen: PropTypes.bool.isRequired,
    selectMode: PropTypes.bool.isRequired,
    onSelectPost: PropTypes.func.isRequired,
    navigateToPost: PropTypes.func.isRequired,
    setSelectMode: PropTypes.func.isRequired,
};

export default PostCard;

const styles = StyleSheet.create({
    image: {
        borderRadius: 30,
        flex: 1,
        width: '100%',
    },
    chosenImage: {
        borderRadius: 30,
        flex: 1,
        width: '100%',
        opacity: 0.5,
    },
    title: {
        marginVertical: 15,
        paddingHorizontal: 10,
        fontFamily: fonts.NEWYORKLARGE_REGULAR,
        color: colors.BLACK,
        fontSize: 18,
    },
    container: {
        width: Dimensions.get('window').width * 0.4,
        height: 250,
    },
    questionContainer: {
        borderRadius: 30,
        borderWidth: 1,
        borderColor: colors.GREY,
        marginBottom: 20,
    },
    question: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.DARK_GREY,
    },
    authorBarContainer: {
        flexDirection: 'row',
        marginTop: 20,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        marginRight: 10,
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    checkmark: {
        position: 'absolute',
        left: '40%',
        top: 250 / 2 - 34,
        zIndex: 500,
        opacity: 1,
    },
    questionsCheckmark: {
        position: 'absolute',
        left: '45%',
        top: '50%',
        zIndex: 500,
        opacity: 1,
    },
});
