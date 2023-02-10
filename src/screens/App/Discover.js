import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, ScrollView, View, RefreshControl } from 'react-native';
import { connect, useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import * as USER_CONSTANTS from '../../constants/User';
import Toast from '../../components/Toast';
import GlobalStyles from '../../constants/globalStyles';
import { resetNavigation } from '../../actions/appActions';
import { fetchInterestingQA } from '../../actions/interestingQuestionsActions';
import { fetchTrendingTips } from '../../actions/trendingTipsActions';
import { fetchUsefulReviews } from '../../actions/usefulReviewsActions';
import DiscoverHeader from '../../components/Discover/DiscoverHeader';
import TrendingTipsList from '../../components/Discover/TrendingTipsList';
import HotItemsList from '../../components/Discover/HotItemsList';
import PopularPeopleList from '../../components/Discover/PopularPeopleList';
import UsefulReviewsList from '../../components/Discover/UsefulReviewsList';
import InterestingQAList from '../../components/Discover/InterestingQAList';
import FeedbackReminderDialog from '../../components/Dialogs/FeedbackReminderDialog';
import FirebaseUser from '../../service/firebase_requests/User';

const Discover = ({
    navigation,
    fetchInterestingQA,
    fetchTrendingTips,
    fetchUsefulReviews,
    resetNavigation,
    notifyNavigation,
}) => {
    const insets = useSafeAreaInsets();
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState('');
    const user = useSelector((state) => state.auth.user);
    const feedbackReminderRef = useRef();

    useEffect(() => {
        if (refreshing) {
            Promise.all([fetchInterestingQA(), fetchTrendingTips(), fetchUsefulReviews()]).finally(() => setRefreshing(false));
        }
    }, [refreshing, fetchInterestingQA]);

    useEffect(() => {
        if (notifyNavigation && notifyNavigation.screen) {
            const available = notifyNavigation.params?.available || false;
            navigation && available && navigation.navigate(notifyNavigation.screen, notifyNavigation.params);
            !available && setError(`this post is no longer available`);
            resetNavigation && setTimeout(resetNavigation, 1000);
        }
    }, [notifyNavigation]);

    useEffect(() => {
        if (user && user?.[USER_CONSTANTS.NUMBER_OF_POSTS] === 2) {
            FirebaseUser.checkFeedbackPrompted()
                .then((prompt) => prompt && setTimeout(() => feedbackReminderRef.current.open(), 500))
                .catch(console.log);
        }
    }, [user?.[USER_CONSTANTS.NUMBER_OF_POSTS], feedbackReminderRef]);

    return (
        <React.Fragment>
            <ScrollView
                style={styles.container}
                contentContainerStyle={{ paddingBottom: 80 }}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => setRefreshing(true)} />}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} containerStyle={{ marginTop: insets.top }} />
                </View>
                <DiscoverHeader navigation={navigation} />
                <View style={styles.listContainer}>
                    <TrendingTipsList navigation={navigation} />
                    <HotItemsList navigation={navigation} />
                    {/* <PopularPeopleList navigation={navigation} /> */}
                    <UsefulReviewsList navigation={navigation} />
                    <InterestingQAList navigation={navigation} />
                </View>
                <FeedbackReminderDialog forwardRef={feedbackReminderRef} navigation={navigation} />
            </ScrollView>
        </React.Fragment>
    );
};

const mapStateToProps = (state) => ({
    notifyNavigation: state.app.navigation,
});

const mapDispatchToProps = {
    fetchInterestingQA,
    fetchTrendingTips,
    fetchUsefulReviews,
    resetNavigation,
};

export default connect(mapStateToProps, mapDispatchToProps)(Discover);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    listContainer: {
        marginVertical: 20,
        marginLeft: 20,
    },
});
