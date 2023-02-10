import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Dimensions, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import firestore from '@react-native-firebase/firestore';
import FastImage from 'react-native-fast-image';
import PropTypes from 'prop-types';
import User from '../../service/firebase_requests/User';
import Anonymous from '../../assets/Images/anonymous.svg';
import { colors, fonts } from '../../constants';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';

const PostCard = ({ navigation, disableAvatar, item, width, height }) => {
    const [author, setAuthor] = useState(null);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        item.author && User.getUserById(item.author).then(setAuthor).catch(console.log);
    }, [item.author]);

    const onPress = () => {
        switch (item?.type) {
            case DATABASE_CONSTANTS.TIPS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.TIPS, { tipID: item.id });
            case DATABASE_CONSTANTS.QUESTIONS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.QUESTIONS, { questionID: item.id });
            case DATABASE_CONSTANTS.REVIEWS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.REVIEWS, { reviewID: item.id });
            default:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.PRODUCT, { productID: item.id });
        }
    };

    const navigateToAuthor = () => {
        if (author && navigation) {
            if (author.uid === user?.uid) {
                navigation.navigate(NAVIGATOR_CONSTANTS.PROFILE, { screen: NAVIGATOR_CONSTANTS.MY_PROFILE });
            } else {
                navigation.push(NAVIGATOR_CONSTANTS.USER_PROFILE, { userID: author.uid });
            }
        }
    };

    const timestamp = item?.created_at?.toDate
        ? item.created_at.toDate()
        : new firestore.Timestamp(item.created_at._seconds, item.created_at._nanoseconds);

    switch (item?.type) {
        case DATABASE_CONSTANTS.TIPS:
            return (
                <TouchableOpacity style={{ width }} onPress={onPress}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.cover}
                        style={[styles.image, { width, height }]}
                        source={{ uri: item.image_url }}
                    />
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
            );
        case DATABASE_CONSTANTS.QUESTIONS:
            if (!author) return null;
            else {
                return (
                    <TouchableOpacity style={styles.questionContainer} onPress={onPress}>
                        {disableAvatar ? (
                            <View style={styles.authorBarContainer}>
                                <Text style={styles.timestamp}>
                                    {`${moment(timestamp).fromNow()}`} {moment(timestamp).fromNow() !== 'now' && 'ago'}
                                </Text>
                            </View>
                        ) : (
                            <View style={styles.authorBarContainer}>
                                {item?.anonymous ? (
                                    <View style={styles.anonymousContainer}>
                                        <Anonymous style={styles.anonymous} />
                                    </View>
                                ) : (
                                    <TouchableOpacity onPress={navigateToAuthor}>
                                        <FastImage
                                            source={{ uri: author.avatar_url }}
                                            style={styles.avatar}
                                            resizeMode={FastImage.resizeMode.contain}
                                        />
                                    </TouchableOpacity>
                                )}
                                <View style={styles.authorBar}>
                                    <Text style={styles.name}>{item?.anonymous ? 'anonymous' : author.name}</Text>
                                    <Text style={styles.timestamp}>
                                        {`${moment(timestamp).fromNow()}`} {moment(timestamp).fromNow() !== 'now' && 'ago'}
                                    </Text>
                                </View>
                            </View>
                        )}
                        <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.question}>
                            {item.question}
                        </Text>
                        {item.image_url && (
                            <FastImage
                                resizeMode={FastImage.resizeMode.cover}
                                style={[styles.image, { width: '100%', height: 250 }]}
                                source={{ uri: item.image_url }}
                            />
                        )}
                    </TouchableOpacity>
                );
            }
        case DATABASE_CONSTANTS.REVIEWS:
            return (
                <TouchableOpacity style={{ width }} onPress={onPress}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        style={[styles.image, { width, height }]}
                        source={{ uri: item?.product?.image || (Array.isArray(item?.image_url) && item?.image_url[0]) }}
                    />
                    <Text numberOfLines={1} ellipsizeMode={'tail'} style={styles.title}>
                        {item.title}
                    </Text>
                </TouchableOpacity>
            );
        default:
            return (
                <TouchableOpacity style={{ width }} onPress={onPress}>
                    <FastImage
                        resizeMode={FastImage.resizeMode.contain}
                        style={[styles.image, { width, height }]}
                        source={{
                            uri:
                                Array.isArray(item.image_url) && item.image_url.length > 0
                                    ? item.image_url[0]
                                    : item.product?.main_image?.link || item.product?.images[0],
                        }}
                    />
                    <Text numberOfLines={2} ellipsizeMode={'tail'} style={styles.title}>
                        {item.product?.title}
                    </Text>
                </TouchableOpacity>
            );
    }
};

PostCard.defaultProps = {
    width: Dimensions.get('window').width * 0.45,
    height: 200,
    disableAvatar: false,
};

PostCard.propTypes = {
    navigation: PropTypes.object.isRequired,
    item: PropTypes.shape({
        id: PropTypes.string.isRequired,
        type: PropTypes.string,
    }).isRequired,
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    disableAvatar: PropTypes.bool.isRequired,
};

export default PostCard;

const styles = StyleSheet.create({
    image: {
        borderRadius: 30,
    },
    title: {
        marginVertical: 15,
        paddingHorizontal: 10,
        fontFamily: fonts.NEWYORKLARGE_REGULAR,
        color: colors.BLACK,
        fontSize: 18,
    },
    questionContainer: {
        borderRadius: 20,
        borderWidth: 1,
        borderColor: colors.GREY,
        margin: 20,
    },
    question: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    timestamp: {
        paddingRight: 20,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.DARK_GREY,
    },
    authorBarContainer: {
        padding: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    anonymousContainer: {
        width: 50,
        height: 50,
    },
    anonymous: {
        transform: [{ rotate: '180deg' }],
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
        marginRight: 10,
    },
    authorBar: {},
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
});
