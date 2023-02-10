import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, SafeAreaView, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import User from '../../../service/firebase_requests/User';
import * as USER_CONSTANTS from '../../../constants/User';
import * as DATABASE_CONSTANTS from '../../../constants/Database';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants/';
import FirebaseFeed from '../../../service/firebase_requests/Feed';
import FirebaseProduct from '../../../service/firebase_requests/Product';
import FirebaseErrors from '../../../service/firebase_errors/';
import Toast from '../../../components/Toast';
import Header from '../../../components/Profile/Header';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import UserInfo from '../../../components/Profile/UserInfo';
import Stat from '../../../components/Profile/Stat';
import FollowBar from '../../../components/Profile/FollowBar';
import SectionsBar from '../../../components/Profile/SectionsBar';
import UserSettingsDialog from '../../../components/Dialogs/UserSettingsDialog';
import PostCard from '../../../components/Profile/PostCard';
import EmptyBackground from '../../../assets/Images/no_messages.png';

const UserProfile = ({ route, navigation }) => {
    const userID = route.params.userID;
    const currentUser = useSelector((state) => state.auth.user);
    const [user, setUser] = useState(null);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(DATABASE_CONSTANTS.ITEMS);
    const [data, setData] = useState(null);
    const [status, setStatus] = useState(null);
    const [yPosition, setYPosition] = useState(0);
    const userSettingsDialogRef = useRef();
    const listRef = useRef();
    const privateUser = user && user[USER_CONSTANTS.PRIVACY_PREFERENCE] === 'private' && (!status || status?.pending);

    useEffect(() => {
        currentUser && User.createRecent(userID).catch((error) => FirebaseErrors.setError(error, setError));
    }, [userID]);

    useEffect(() => {
        const onUserSnapshot = (userSnapshot) => {
            return setUser({ uid: userSnapshot.id, ...userSnapshot.data() });
        };
        const unsubscribe = User.retrieveUserById(userID, onUserSnapshot, (error) => FirebaseErrors.setError(error, setError));
        return unsubscribe;
    }, [userID]);

    useEffect(() => {
        if (user?.role === 'admin') {
            setTimeout(() => setSelected(DATABASE_CONSTANTS.TIPS), 250);
        }
    }, [user?.role]);

    useEffect(() => {
        if (user?.uid) {
            setData(null);
            switch (selected) {
                case DATABASE_CONSTANTS.ITEMS:
                    FirebaseProduct.getUserPorductsByUserID(user.uid)
                        .then((res) => {
                            setData(res || []);
                            listRef.current && listRef.current.scrollToOffset({ offset: yPosition });
                        })
                        .catch((error) => FirebaseErrors.setError(error, setError));
                    break;
                case DATABASE_CONSTANTS.TIPS:
                case DATABASE_CONSTANTS.REVIEWS:
                case DATABASE_CONSTANTS.QUESTIONS:
                    FirebaseFeed.getPostsByTypeAndUserID(user.uid, selected)
                        .then((res) => {
                            setData(res || []);
                            listRef.current && listRef.current.scrollToOffset({ offset: yPosition });
                        })
                        .catch((error) => FirebaseErrors.setError(error, setError));
                    break;
                default:
                    return;
            }
        }
    }, [selected, user]);

    const settingsOnPress = () => {
        userSettingsDialogRef && userSettingsDialogRef.current.open();
    };

    const onScroll = (e) => {
        setYPosition(e.nativeEvent.contentOffset.y);
    };

    const _renderEmptyComponent = () => {
        if (!data || privateUser) return null;
        else {
            switch (selected) {
                case DATABASE_CONSTANTS.TIPS:
                    return (
                        <View>
                            <FastImage
                                source={EmptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: 250 }}
                            />
                            <Text style={styles.emptyMessage}>no tips yet</Text>
                        </View>
                    );
                case DATABASE_CONSTANTS.QUESTIONS:
                    return (
                        <View>
                            <FastImage
                                source={EmptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: 250 }}
                            />
                            <Text style={styles.emptyMessage}>no questions yet</Text>
                        </View>
                    );
                case DATABASE_CONSTANTS.REVIEWS:
                    return (
                        <View>
                            <FastImage
                                source={EmptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: 250 }}
                            />
                            <Text style={styles.emptyMessage}>no reviews yet</Text>
                        </View>
                    );
                case DATABASE_CONSTANTS.ITEMS:
                    return (
                        <View>
                            <FastImage
                                source={EmptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: 250 }}
                            />
                            <Text style={styles.emptyMessage}>no items yet</Text>
                        </View>
                    );
                default:
                    return null;
            }
        }
    };

    if (!user) {
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <LoadingDotsOverlay animation />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <LoadingDotsOverlay animation={loading} />
                <FlatList
                    ListHeaderComponent={
                        <React.Fragment>
                            <View style={styles.avatarBackgroundContainer}>
                                <Header navigation={navigation} settingsOnPress={settingsOnPress} />
                                <FastImage source={{ uri: user[USER_CONSTANTS.AVATAR_URL] }} style={[styles.avatar]} />
                            </View>
                            <UserInfo
                                navigation={navigation}
                                user={user}
                                setError={setError}
                                loading={loading}
                                setLoading={setLoading}
                            />
                            <Stat navigation={navigation} user={user} setError={setError} />
                            {currentUser && (
                                <FollowBar
                                    navigation={navigation}
                                    user={user}
                                    setError={setError}
                                    loading={loading}
                                    setLoading={setLoading}
                                    status={status}
                                    setStatus={setStatus}
                                />
                            )}
                            <SectionsBar user={user} selected={selected} setSelected={setSelected} status={status} />
                        </React.Fragment>
                    }
                    ListHeaderComponentStyle={{ alignItems: 'center' }}
                    ListEmptyComponent={_renderEmptyComponent()}
                    ref={listRef}
                    key={selected === DATABASE_CONSTANTS.QUESTIONS ? 1 : 2}
                    numColumns={selected === DATABASE_CONSTANTS.QUESTIONS ? 1 : 2}
                    initialNumToRender={6}
                    data={privateUser ? [] : data}
                    renderItem={({ item }) => <PostCard navigation={navigation} item={item} />}
                    contentContainerStyle={{ paddingBottom: 80 }}
                    columnWrapperStyle={selected === DATABASE_CONSTANTS.QUESTIONS ? null : { justifyContent: 'space-evenly' }}
                    onScroll={onScroll}
                />

                <UserSettingsDialog
                    forwardRef={userSettingsDialogRef}
                    user={user}
                    setError={setError}
                    loading={loading}
                    setLoading={setLoading}
                />
            </SafeAreaView>
        );
    }
};

export default UserProfile;

const styles = StyleSheet.create({
    avatarBackgroundContainer: {
        height: 200,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    avatar: {
        position: 'absolute',
        bottom: 0,
        height: 120,
        width: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 120 / 2,
    },
    sectionContainer: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        marginVertical: 30,
    },
    section: {
        alignItems: 'center',
        paddingHorizontal: 15,
    },
    iconContainer: {
        width: 40,
        height: 40,
        borderRadius: 40 / 2,
        backgroundColor: colors.GREY,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10,
    },
    icon: {
        fontSize: 20,
        color: colors.PRIMARY_COLOR,
        textAlign: 'center',
    },
    title: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
        color: colors.BLACK,
    },
    emptyMessage: {
        textAlign: 'center',
    },
});
