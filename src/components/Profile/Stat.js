import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import User from '../../service/firebase_requests/User';
import * as USER_CONSTANTS from '../../constants/User';
import FirebaseErrors from '../../service/firebase_errors';
import { FOLLOWERS } from '../../navigator/constants';
import { fonts } from '../../constants';
const { width } = Dimensions.get('window');

const Stat = ({ navigation, myself, user, setError }) => {
    const [followers, setFollowers] = useState([]);
    const [following, setFollowing] = useState([]);
    if (!user || !user.uid || !user.username) return null;

    // useEffect(() => {
    //     let unsubscribe;
    //     if (user.uid) {
    //         unsubscribe = User.retrieveFollowers(
    //             user.uid,
    //             (querySnapshot) => {
    //                 setFollowers(querySnapshot.docs);
    //             },
    //             (error) => FirebaseErrors.setError(error, setError),
    //         );
    //     }

    //     return () => unsubscribe && unsubscribe();
    // }, [user]);

    // useEffect(() => {
    //     let unsubscribe;
    //     if (user.uid) {
    //         unsubscribe = User.retrieveFollowing(
    //             user.uid,
    //             (querySnapshot) => {
    //                 setFollowing(querySnapshot.docs);
    //             },
    //             (error) => FirebaseErrors.setError(error, setError),
    //         );
    //     }

    //     return () => unsubscribe && unsubscribe();
    // }, [user]);

    const _followersOnPress = () => {
        navigation && navigation.push(FOLLOWERS, { user: { uid: user.uid, username: user.username }, myself, followers: true });
    };

    const _followingsOnPress = () => {
        navigation && navigation.push(FOLLOWERS, { user: { uid: user.uid, username: user.username }, myself, followers: false });
    };

    return (
        <View style={styles.followerStatContainer}>
            <TouchableOpacity onPress={_followingsOnPress}>
                {/* <Text style={styles.stat}>{following.length}</Text> */}
                <Text style={styles.stat}>{user[USER_CONSTANTS.NUMBER_OF_FOLLOWINGS]}</Text>
                <Text style={styles.statTitle}>following</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={_followersOnPress}>
                {/* <Text style={styles.stat}>{followers.length}</Text> */}
                <Text style={styles.stat}>{user[USER_CONSTANTS.NUMBER_OF_FOLLOWERS]}</Text>
                <Text style={styles.statTitle}>followers</Text>
            </TouchableOpacity>
        </View>
    );
};

Stat.defaultProps = {
    myself: false,
};

export default Stat;

const styles = StyleSheet.create({
    followerStatContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: width * 0.45,
        alignItems: 'center',
    },
    stat: {
        textAlign: 'center',
        fontFamily: fonts.NEWYORKLARGE_SEMIBOLD,
        fontSize: 24,
    },
    statTitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
});
