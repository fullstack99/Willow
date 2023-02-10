import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { View, SafeAreaView, Text, StyleSheet, FlatList, Dimensions, Animated, RefreshControl } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { resetNavigation } from '../../actions/appActions';
import { initFeed, getMoreFeed, selectType } from '../../actions/feedActions';
import FastImage from 'react-native-fast-image';
import { colors, fonts, emoji } from '../../constants';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import * as USER_CONSTANTS from '../../constants/User';
import GlobalStyles from '../../constants/globalStyles';
import HeaderIcon from '../../components/App/HeaderIcon';
import FilterBar from '../../components/FilterBar';
import FeedCard from '../../components/Feed/FeedCard';
import EmptyFeed from '../../assets/Images/emptyFeed.png';
import Logo from '../../assets/Images/header.png';
import HeaderShoppingBag from '../../assets/Images/Feed/header_shoppingbag.svg';
import NotificationBell from '../../assets/Images/Feed/bell.svg';
import NotificationRedDotBell from '../../assets/Images/Feed/bell-red-dot.svg';
import FloatingMilkBottle from '../../components/Feed/FloatingMilkBottle';
import FirebaseUser from '../../service/firebase_requests/User';
import FirebaseAnalytics from '../../service/firebase_analytics';
import FirebaseErrors from '../../service/firebase_errors';
import Toast from '../../components/Toast';
import LoadingDotsOverlay from '../../components/LoadingDotsOverlay';
import CustomFastImage from '../../components/App/CustomFastImage';
import StatusReminder from '../../components/Dialogs/StatusReminder';
import FeedbackReminderDialog from '../../components/Dialogs/FeedbackReminderDialog';
import { getRandomInt } from '../../utility';

const Feed = ({
    navigation,
    notifyNavigation,
    resetNavigation,
    feed,
    feedLoading,
    selected,
    initFeed,
    getMoreFeed,
    selectType,
}) => {
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const [milkBottles, setMilkBottles] = useState([]);
    const [width, setWidth] = useState(0);
    const [height, setHeight] = useState(0);
    const notifications = useSelector((state) => state.notification.notifications);
    const user = useSelector((state) => state.auth.user);
    const statusReminderRef = useRef();
    const feedbackReminderRef = useRef();

    const _onShoppingBagPress = () => {
        FirebaseAnalytics.logShoppingBagClick().catch(console.log);
        return navigation && navigation.push(NAVIGATOR_CONSTANTS.WEBVIEW, { uri: 'http://www.willow.app/shop' });
    };

    useLayoutEffect(() => {
        navigation &&
            navigation.setOptions({
                headerLeft: () => (
                    <HeaderIcon style={{ marginLeft: 10 }} onPress={_onShoppingBagPress}>
                        <HeaderShoppingBag />
                    </HeaderIcon>
                ),
                title: <CustomFastImage source={Logo} maxWidth={100} maxHeight={Dimensions.get('window').height} />,
                headerRight: () => (
                    <HeaderIcon
                        style={{ marginRight: 10 }}
                        onPress={() => navigation && navigation.push(NAVIGATOR_CONSTANTS.NOTIFICATIONS)}>
                        {notifications?.findIndex((n) => !n.read) === -1 ? <NotificationBell /> : <NotificationRedDotBell />}
                    </HeaderIcon>
                ),
            });
    }, [navigation, notifications]);

    useEffect(() => {
        selected === 'ALL'
            ? initFeed()
                  .then(() => setRefreshing(false))
                  .catch((error) => FirebaseErrors.setError(error, setError))
            : initFeed(selected)
                  .then(() => setRefreshing(false))
                  .catch((error) => FirebaseErrors.setError(error, setError));
    }, [refreshing, selected]);

    useEffect(() => {
        if (notifyNavigation && notifyNavigation.screen) {
            const available = notifyNavigation.params.params?.available || false;
            navigation && available && navigation.navigate(notifyNavigation.screen, notifyNavigation.params);
            !available && setError(`this post is no longer available`);
            resetNavigation && setTimeout(resetNavigation, 1000);
        }
    }, [navigation, notifyNavigation]);

    useEffect(() => {
        FirebaseUser.checkUserStatusReminder()
            .then((response) => {
                response && setTimeout(() => statusReminderRef.current.open(), 500);
            })
            .catch(console.log);
    }, [statusReminderRef]);

    useEffect(() => {
        if (user && user[USER_CONSTANTS.NUMBER_OF_POSTS] === 2) {
            FirebaseUser.checkFeedbackPrompted()
                .then((prompt) => prompt && setTimeout(() => feedbackReminderRef.current.open(), 500))
                .catch(console.log);
        }
    }, [user?.[USER_CONSTANTS.NUMBER_OF_POSTS], feedbackReminderRef]);

    const updateFilters = (key) => selected !== key && selectType(key);

    const addMilkBottle = () => {
        const animation = new Animated.Value(Dimensions.get('window').height);
        setMilkBottles([...milkBottles, { animation, start: getRandomInt(100, Dimensions.get('window').width - 100) }]);
        Animated.timing(animation, {
            toValue: 0,
            duration: 3000,
            useNativeDriver: true,
        }).start();
    };

    const onEndReached = () => {
        if (!feed.loading && !feed.endReached && feed.endDocument) {
            selected === 'ALL'
                ? getMoreFeed().catch((error) => FirebaseErrors.setError(error, setError))
                : getMoreFeed(selected).catch((error) => FirebaseErrors.setError(error, setError));
        }
    };

    const onRefresh = () => {
        setRefreshing(true);
    };

    const setAspectRatio = (evt) => {
        const maxHeight = 300;
        const maxWidth = Dimensions.get('window').width * 0.8;
        const ratio = Math.min(maxWidth / evt.nativeEvent.width, maxHeight / evt.nativeEvent.height);
        setWidth(evt.nativeEvent.width * ratio);
        setHeight(evt.nativeEvent.height * ratio);
    };

    if (!feed.items) {
        return (
            <SafeAreaView style={styles.container}>
                <LoadingDotsOverlay animation />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={GlobalStyles.alignCenterContainer}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <FilterBar disabled={feed.loading} selected={selected} onChange={updateFilters} />

            <React.Fragment>
                <FloatingMilkBottle milkBottles={milkBottles}>
                    <View />
                    <FlatList
                        data={selected === 'ALL' ? feed.items : feed.items.filter((p) => p.type === selected)}
                        keyExtractor={(item) => item.id}
                        renderItem={({ item }) => (
                            <FeedCard
                                data={item}
                                navigation={navigation}
                                addMilkBottle={addMilkBottle}
                                setError={setError}
                                setLoading={setLoading}
                            />
                        )}
                        style={styles.feedContainer}
                        contentContainerStyle={styles.feedCardContainer}
                        initialNumToRender={20}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.016}
                        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
                        ListEmptyComponent={() => {
                            if (feedLoading) return null;
                            else
                                return (
                                    <View style={styles.container}>
                                        <FastImage
                                            source={EmptyFeed}
                                            onLoad={setAspectRatio}
                                            resizeMode={FastImage.resizeMode.contain}
                                            style={{ width, height }}
                                        />
                                        <Text style={styles.emptyFeedTitle}>be in the know!</Text>
                                        <Text style={styles.emptyFeedContent}>
                                            {`go to the discover tab (${emoji.search}) to search and add your friends on willow ${emoji.heart}`}
                                        </Text>
                                    </View>
                                );
                        }}
                    />
                </FloatingMilkBottle>
            </React.Fragment>
            <StatusReminder forwardRef={statusReminderRef} navigation={navigation} />
            <FeedbackReminderDialog forwardRef={feedbackReminderRef} navigation={navigation} />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    feed: state.feed,
    selected: state.feed.selected,
    feedLoading: state.feed.loading,
    notifyNavigation: state.app.navigation,
});

const mapDispatchToProps = {
    initFeed,
    getMoreFeed,
    selectType,
    resetNavigation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Feed);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
    },
    feedContainer: {
        flex: 1,
        width: '100%',
    },
    feedCardContainer: {
        margin: 20,
        paddingBottom: 120,
    },
    emptyFeedTitle: {
        fontFamily: fonts.NEWYORKEXTRALARGE_MEDIUM,
        fontSize: 30,
        marginBottom: 20,
    },
    emptyFeedContent: {
        fontFamily: fonts.NEWYORKSMALL_REGULAR,
        fontSize: 20,
        paddingHorizontal: 40,
        textAlign: 'center',
    },
});
