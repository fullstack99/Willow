import React, { useState, useLayoutEffect, useRef, useEffect } from 'react';
import {
    StyleSheet,
    SafeAreaView,
    View,
    FlatList,
    TouchableOpacity,
    TextInput,
    Dimensions,
    Keyboard,
    RefreshControl,
} from 'react-native';
import { connect } from 'react-redux';
import GlobalStyles from '../../constants/globalStyles';
import { colors, fonts } from '../../constants';
import User from '../../service/firebase_requests/User';
import FirebaseErrors from '../../service/firebase_errors';
import * as USER_CONSTANTS from '../../constants/User';
import { USER_PROFILE, MY_PROFILE } from '../../navigator/constants';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FilterIcon from '../../assets/Images/filter.svg';
import FollowButton from '../../assets/Images/follow_button.svg';
import FriendButton from '../../assets/Images/mutual_friend_button.svg';
import AlreadyFollowedButton from '../../assets/Images/already_followed_button.svg';
import FilterDialog from '../../components/Dialogs/FilterDialog';
import StatusDialog from '../../components/Dialogs/StatusDialog';
import Toast from '../../components/Toast';
import UserTab from '../../components/UserTab';

const { height, width } = Dimensions.get('window');

const AddFriend = ({ navigation, user, following }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity style={styles.rightIcon} onPress={openFilter}>
                    <FilterIcon height={30} />
                </TouchableOpacity>
            ),
        });
    }, [navigation]);
    const filterDialogRef = useRef();
    const statusDialogRef = useRef();
    const [city, setCity] = useState('');
    const [status, setStatus] = useState('');
    const [children, setChildren] = useState('');
    const [selectedType, setSelectedType] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [nbPages, setNBPages] = useState(0);
    const [people, setPeople] = useState([]);

    useEffect(() => {
        if (!search) {
            User.getAllUsers()
                .then((res) => (user?.uid ? setPeople(res.filter((u) => u.uid !== user.uid)) : setPeople(res)))
                .catch((error) => FirebaseErrors.setError(error, setError));
        }
    }, [search]);

    const openFilter = () => {
        Keyboard.dismiss();
        filterDialogRef.current && filterDialogRef.current.open();
    };

    const applyFilter = () => {
        filterDialogRef.current && filterDialogRef.current.close();
        reset();
        onSearchSubmit();
    };

    const reset = () => {
        setPage(0);
        setNBPages(0);
        setPeople([]);
    };

    const resetFilter = () => {
        setCity('');
        setChildren('');
        setSelectedType([]);
        setStatus('');
    };

    const setToastError = (message) => {
        setError(message);
        setTimeout(() => setError(''), 4000);
    };

    const onSearchSubmit = () => {
        if (search.length > 0) {
            reset();
            setLoading(true);
            User.getUserByNameAndFilter(search, 0, { city, status, children, selectedType })
                .then(({ data }) => {
                    setPeople(data.hits);
                    setPage(data.page);
                    setNBPages(data.nbPages);
                })
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        }
    };

    const userOnPress = (userID) => {
        if (userID === user.uid) {
            navigation.navigate(MY_PROFILE);
        } else {
            navigation.push(USER_PROFILE, { userID });
        }
    };

    const addFriend = (user) => {
        if (!user) return;
        setLoading(true);
        if (user[USER_CONSTANTS.PRIVACY_PREFERENCE] === 'private') {
            return User.requestToFollowUserById(user.objectID || user.uid)
                .catch(setToastError)
                .finally(() => setLoading(false));
        } else {
            return User.followUserById(user.objectID || user.uid)
                .catch(setToastError)
                .finally(() => setLoading(false));
        }
    };

    const onEndReached = () => {
        if (search.length > 0 && !loading && page + 1 < nbPages) {
            setLoading(true);
            User.getUserByNameAndFilter(search, page + 1, { city, status, children, selectedType })
                .then(({ data }) => {
                    setPeople(people.concat(data.hits));
                    setPage(data.page);
                })
                .catch(setToastError)
                .finally(() => setLoading(false));
        } else {
            setLoading(false);
        }
    };

    const _renderIcon = (item) => {
        const userID = item.objectID || item.uid;
        if (!user || user.uid === userID || !Array.isArray(following)) return null;
        else {
            const index = following?.findIndex((u) => u.uid === userID);
            if (index === -1) {
                return <FollowButton />;
            } else if (following[index].mutualFriend) {
                return <FriendButton />;
            } else {
                return <AlreadyFollowedButton />;
            }
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <View style={GlobalStyles.searchBar}>
                <FontAwesome name="search" color={colors.PRIMARY_COLOR} size={25} style={{ marginHorizontal: 5 }} />
                <TextInput
                    returnKeyType={'search'}
                    onBlur={onSearchSubmit}
                    blurOnSubmit
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

            <FlatList
                data={people.filter((p) => p.objectID !== user.uid)}
                keyExtractor={(item) => item.objectID || item.uid}
                renderItem={({ item }) => (
                    <UserTab
                        user={item}
                        icon={_renderIcon(item)}
                        disabled={
                            loading ||
                            !user ||
                            (user && following?.findIndex((u) => u.uid === (item.objectID || item.uid)) !== -1)
                        }
                        onPress={() => userOnPress(item.objectID || item.uid)}
                        iconOnPress={addFriend}
                    />
                )}
                refreshControl={<RefreshControl refreshing={loading} />}
                onEndReached={onEndReached}
                onEndReachedThreshold={0.016}
            />

            <FilterDialog
                filterDialogRef={filterDialogRef}
                statusDialogRef={statusDialogRef}
                applyFilter={applyFilter}
                resetFilter={resetFilter}
                status={status}
                city={city}
                setCity={setCity}
                children={children}
                setChildren={setChildren}
                selectedType={selectedType}
                setSelectedType={setSelectedType}
            />
            <StatusDialog
                statusDialogRef={statusDialogRef}
                filterDialogRef={filterDialogRef}
                status={status}
                setStatus={setStatus}
            />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    following: state.auth.following,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(AddFriend);

const styles = StyleSheet.create({
    rightIcon: {
        paddingHorizontal: 15,
        marginRight: 10,
    },
});
