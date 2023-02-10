import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, FlatList, TouchableOpacity, Image } from 'react-native';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import FirebaseErrors from '../../service/firebase_errors';
import User from '../../service/firebase_requests/User';
import * as USER_CONSTANTS from '../../constants/User';
import UserTab from '../UserTab';
import FollowButton from '../../assets/Images/follow_button.svg';
import AlreadyFollowedButton from '../../assets/Images/already_followed_button.svg';
import MutualFriendButton from '../../assets/Images/mutual_friend_button.svg';
import { USER_PROFILE, PROFILE, MY_PROFILE } from '../../navigator/constants';

const People = ({
    navigation,
    user,
    following,
    visible,
    setSearch,
    searchTerm,
    searchTrigger,
    setError,
    loading,
    setLoading,
}) => {
    const [people, setPeople] = useState([]);
    const [page, setPage] = useState(0);
    const [nbPages, setNBPages] = useState(0);

    useEffect(() => {
        if (visible && searchTerm.length > 0) {
            setLoading(true);
            User.getUsersByName(searchTerm, 0)
                .then((res) => {
                    const { data } = res;
                    setPeople(data.hits);
                    setPage(data.page);
                    setNBPages(data.nbPages);
                })
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        } else {
            setPeople([]);
        }
    }, [setPeople, visible, searchTrigger]);

    const onEndReached = () => {
        if (searchTerm.length > 0 && page < nbPages && !loading) {
            User.getUsersByName(searchTerm, page + 1)
                .then((res) => {
                    const { data } = res;
                    setPeople([...people, ...data.hits]);
                    setPage(data.page);
                })
                .catch((error) => FirebaseErrors.setError(error, setError));
        }
    };

    const onPress = (userID) => {
        if (!userID) return;
        else if (userID === user?.uid) {
            navigation.navigate(PROFILE, { screen: MY_PROFILE });
        } else {
            userID && navigation.push(USER_PROFILE, { userID });
        }
    };

    const iconOnPress = (user) => {
        if (!user) return;
        setLoading(true);
        if (user[USER_CONSTANTS.PRIVACY_PREFERENCE] === 'private') {
            return User.requestToFollowUserById(user.objectID)
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        } else {
            return User.followUserById(user.objectID)
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        }
    };

    const _renderIcon = (item) => {
        return !user || !Array.isArray(following) || user.uid === item.objectID ? null : following.findIndex(
              (u) => u.uid === item.objectID,
          ) !== -1 ? (
            following.filter((u) => u.uid === item.objectID)[0].mutualFriend ? (
                <MutualFriendButton />
            ) : (
                <AlreadyFollowedButton />
            )
        ) : (
            <FollowButton />
        );
    };

    if (!visible) return null;

    return (
        <FlatList
            keyExtractor={(item) => item.objectID}
            data={people}
            renderItem={({ item }) => (
                <UserTab
                    user={item}
                    icon={_renderIcon(item)}
                    disabled={loading || !user || (user && following?.findIndex((u) => u.uid === item.objectID) !== -1)}
                    onPress={onPress}
                    iconOnPress={iconOnPress}
                />
            )}
            onEndReached={onEndReached}
            onEndReachedThreshold={0.016}
        />
    );
};

People.propTypes = {
    navigation: PropTypes.object.isRequired,
    user: PropTypes.object,
    visible: PropTypes.bool.isRequired,
    setSearch: PropTypes.func,
    searchTerm: PropTypes.string.isRequired,
    searchTrigger: PropTypes.bool,
    setError: PropTypes.func,
    loading: PropTypes.bool,
    setLoading: PropTypes.func,
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    following: state.auth.following,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(People);

const styles = StyleSheet.create({});
