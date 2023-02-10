import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, TextInput, TouchableOpacity, FlatList } from 'react-native';
import { connect } from 'react-redux';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FollowButton from '../../../assets/Images/follow_button.svg';
import AlreadyFollowedButton from '../../../assets/Images/already_followed_button.svg';
import MutualFriendButton from '../../../assets/Images/mutual_friend_button.svg';
import * as USER_CONSTANTS from '../../../constants/User';
import { USER_PROFILE, MY_PROFILE, PROFILE } from '../../../navigator/constants';
import User from '../../../service/firebase_requests/User';
import FirebaseErrors from '../../../service/firebase_errors';
import UserTab from '../../../components/UserTab';
import Toast from '../../../components/Toast';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';

const Followers = ({ navigation, route, currentUser, following }) => {
    if (!route.params.user) return null;
    const user = route.params.user;
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [refresh, setRefresh] = useState(true);
    const [error, setError] = useState('');
    const [followers, setFollowers] = useState(null);
    const [followings, setFollowings] = useState(null);
    const [followersTab, setFollowersTab] = useState(route.params.followers);
    const re = new RegExp(search + '.*$', 'i');

    useLayoutEffect(() => {
        route.params.user &&
            navigation.setOptions({
                title: route.params.user.username,
            });
    }, [navigation]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // The screen is focused
            // Call any action
            setRefresh(true);
        });

        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [navigation]);

    useEffect(() => {
        if (refresh) {
            Promise.all([
                User.getListOfFollowers(user.uid)
                    .then((data) => {
                        const sortedData = data;
                        Array.isArray(sortedData) && sortedData.sort((a, b) => a.name.localeCompare(b.name));
                        setFollowers(sortedData || []);
                    })
                    .catch((error) => FirebaseErrors.setError(error, setError)),
                User.getListOfFollowings(user.uid)
                    .then((data) => {
                        const sortedData = data;
                        Array.isArray(sortedData) && sortedData.sort((a, b) => a.name.localeCompare(b.name));
                        setFollowings(sortedData || []);
                    })
                    .catch((error) => FirebaseErrors.setError(error, setError)),
            ]).finally(() => setRefresh(false));
        }
    }, [user, refresh]);

    const selectTab = (followersTab) => {
        setFollowersTab(followersTab);
    };

    const userOnPress = (userID) => {
        if (currentUser?.uid === userID) {
            navigation && navigation.navigate(PROFILE, { screen: MY_PROFILE });
        } else {
            navigation && navigation.push(USER_PROFILE, { userID });
        }
    };

    const addFriendOnPress = (user) => {
        if (!user) return;
        setLoading(true);
        if (user[USER_CONSTANTS.PRIVACY_PREFERENCE] === 'private') {
            return User.requestToFollowUserById(user.uid)
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        } else {
            return User.followUserById(user.uid)
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        }
    };

    const _renderIcon = (item) => {
        if (!currentUser || !Array.isArray(following) || item.uid === currentUser.uid) {
            return null;
        } else if (following.findIndex(({ uid }) => uid === item.uid) === -1) {
            return <FollowButton />;
        } else if (following.filter((u) => u.uid === item.uid)[0].mutualFriend) {
            return <MutualFriendButton />;
        } else {
            return <AlreadyFollowedButton />;
        }
    };

    const _disableIcon = (item) => {
        return (
            loading ||
            !user ||
            user.uid === item.uid ||
            !currentUser ||
            currentUser.uid === item.uid ||
            following.findIndex((u) => u.uid === item.uid) !== -1
        );
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading || refresh} />
            <View style={GlobalStyles.searchBar}>
                <FontAwesome name="search" color={colors.PRIMARY_COLOR} size={25} style={{ marginHorizontal: 5 }} />
                <TextInput
                    returnKeyType={'search'}
                    style={GlobalStyles.search}
                    onChangeText={setSearch}
                    value={search}
                    clearButtonMode="while-editing"
                    placeholder={'search...'}
                    placeholderTextColor="#999"
                    autoCorrect={false}
                    autoCapitalize="none"
                />
            </View>

            <View style={styles.tabContainer}>
                <TouchableOpacity
                    style={[styles.tab, { borderBottomColor: followersTab ? colors.PRIMARY_COLOR : colors.GREY }]}
                    onPress={() => selectTab(true)}>
                    <Text style={[styles.tabTitle, { color: followersTab ? colors.PRIMARY_COLOR : colors.BLACK }]}>
                        followers
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.tab, { borderBottomColor: !followersTab ? colors.PRIMARY_COLOR : colors.GREY }]}
                    onPress={() => selectTab(false)}>
                    <Text style={[styles.tabTitle, { color: !followersTab ? colors.PRIMARY_COLOR : colors.BLACK }]}>
                        following
                    </Text>
                </TouchableOpacity>
            </View>
            {Array.isArray(followings) && Array.isArray(followers) && (
                <FlatList
                    data={
                        followersTab
                            ? followers.filter((e, i, a) => {
                                  return e.name?.search(re) != -1;
                              })
                            : followings.filter((e, i, a) => {
                                  return e.name?.search(re) != -1;
                              })
                    }
                    keyExtractor={(item) => item.uid}
                    renderItem={({ item }) => (
                        <UserTab
                            user={item}
                            onPress={userOnPress}
                            disabled={_disableIcon(item)}
                            icon={_renderIcon(item)}
                            iconOnPress={addFriendOnPress}
                            setError={setError}
                        />
                    )}
                    refreshing={refresh}
                    onRefresh={() => !refresh && setRefresh(true)}
                />
            )}
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    currentUser: state.auth.user,
    following: state.auth.following,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Followers);

const styles = StyleSheet.create({
    tabContainer: {
        flexDirection: 'row',
    },
    tab: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 20,
        borderBottomWidth: 2,
    },
    tabTitle: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
    },
});
