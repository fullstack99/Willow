import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FastImage from 'react-native-fast-image';
import firestore from '@react-native-firebase/firestore';
import moment from 'moment';
import { colors, fonts } from '../constants';
import { QUESTIONS, USER_PROFILE, PROFILE, MY_PROFILE } from '../navigator/constants';
import User from '../service/firebase_requests/User';
import Anonymous from '../assets/Images/anonymous.svg';

const InterestingQA = ({ navigation, data, user }) => {
    const [author, setAuthor] = useState(null);

    useEffect(() => {
        User.getUserById(data.author).then(setAuthor).catch(console.log);
    }, [data.author]);

    if (!author) return null;

    const navigateToQuestion = () => {
        navigation && navigation.push(QUESTIONS, { questionID: data.id });
    };

    const navigateToAuthorProfile = () => {
        if (user && user.uid && user.uid === author.uid) {
            navigation && navigation.navigate(PROFILE, { screen: MY_PROFILE });
        } else {
            navigation && navigation.push(USER_PROFILE, { userID: author.uid });
        }
    };

    const timestamp = data.created_at.toDate
        ? data.created_at.toDate()
        : new firestore.Timestamp(data.created_at._seconds, data.created_at._nanoseconds);

    return (
        <TouchableOpacity style={styles.container} onPress={navigateToQuestion}>
            <View style={styles.authorBarContainer}>
                {data?.anonymous ? (
                    <View style={styles.anonymousContainer}>
                        <Anonymous style={styles.anonymous} />
                    </View>
                ) : (
                    <TouchableOpacity onPress={navigateToAuthorProfile}>
                        <FastImage
                            source={{ uri: author.avatar_url }}
                            resizeMode={FastImage.resizeMode.contain}
                            style={styles.avatar}
                        />
                    </TouchableOpacity>
                )}
                <View style={styles.authorBar}>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                        {data?.anonymous ? 'anonymous' : author.name}
                    </Text>
                    <Text style={styles.timestamp}>{moment(timestamp.toDate()).fromNow()}</Text>
                </View>
            </View>
            <Text style={styles.content}>{data.question}</Text>
        </TouchableOpacity>
    );
};

InterestingQA.propTypes = {
    navigation: PropTypes.object.isRequired,
    user: PropTypes.object,
    data: PropTypes.shape({ id: PropTypes.string.isRequired, author: PropTypes.string.isRequired }).isRequired,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(InterestingQA);

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginRight: 20,
        borderWidth: 1,
        borderColor: '#F1F1F1',
        borderRadius: 20,
        width: 300,
    },
    authorBarContainer: {
        flexDirection: 'row',
    },
    authorBar: {
        justifyContent: 'center',
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
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: '#9D9D9D',
    },
    content: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        paddingTop: 15,
    },
});
