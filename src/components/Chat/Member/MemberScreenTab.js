import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import moment from 'moment';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../../../constants';
import { USER_PROFILE, PROFILE, MY_PROFILE } from '../../../navigator/constants';
import FirebaseUser from '../../../service/firebase_requests/User';

// const localMoment = moment;
// localMoment.updateLocale('en', {
//     relativeTime: {
//         s: 'last seen recently',
//         m: 'last seen a minute ago',
//         mm: 'last seen %d minutes ago',
//         h: 'last seen an hour ago',
//         hh: 'last seen %d hours ago',
//         d: 'last seen a day ago',
//         dd: 'last seen %d days ago',
//         M: 'last seen a month ago',
//         MM: 'last seen %d months ago',
//         y: 'last seen a year ago',
//         yy: 'last seen %d years ago',
//     },
// });

const MemberScreenTab = ({ navigation, member, isAdmin }) => {
    const currentUser = useSelector((state) => state.auth.user);
    const [user, setUser] = useState(null);

    useEffect(() => {
        if (member?.uid) {
            FirebaseUser.getUserById(member.uid).then(setUser).catch(console.log);
        }
    }, [member?.uid]);

    const navigateToUser = () => {
        if (currentUser && user) {
            if (currentUser?.uid === user?.uid) {
                return navigation && navigation.navigate(PROFILE, { screen: MY_PROFILE });
            } else {
                return navigation && navigation.push(USER_PROFILE, { userID: user.uid });
            }
        }
    };

    const _renderLastSeen = () => {
        if (!member?.last_seen || !member.last_seen?.toDate) return null;
        else {
            return <Text style={styles.last_seen}>{`last seen ${moment(member.last_seen.toDate()).fromNow()}`}</Text>;
        }
    };

    const _renderRightProps = () => {
        if (isAdmin) {
            return <Text style={styles.admin}>admin</Text>;
        } else {
            return null;
        }
    };

    if (!user || !user?.uid) return null;
    return (
        <TouchableOpacity style={styles.container} onPress={navigateToUser}>
            <FastImage source={{ uri: user?.avatar_url }} resizeMode={FastImage.resizeMode.contain} style={styles.avatar} />
            <View style={styles.nameContainer}>
                <Text style={styles.name}>{user?.name}</Text>
                {_renderLastSeen()}
            </View>
            {_renderRightProps()}
        </TouchableOpacity>
    );
};

export default MemberScreenTab;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        paddingBottom: 20,
    },
    avatar: {
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
        marginRight: 20,
    },
    nameContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        paddingRight: 20,
    },
    name: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
    },
    last_seen: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.GREY_2,
    },
    admin: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.GREY_2,
        alignSelf: 'center',
    },
});
