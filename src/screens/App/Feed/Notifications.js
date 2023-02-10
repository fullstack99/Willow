import React, { useState, useLayoutEffect } from 'react';
import { StyleSheet, Text, SafeAreaView, View, SectionList } from 'react-native';
import { connect } from 'react-redux';
import firestore from '@react-native-firebase/firestore';
import { resetNotifications } from '../../../actions/notificationActions';
import FastImage from 'react-native-fast-image';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import FirebaseNotification from '../../../service/firebase_requests/Notification';
import FirebaseErrors from '../../../service/firebase_errors';
import NotificationTab from '../../../components/Notification/NotificationTab';
import Toast from '../../../components/Toast';
import HeaderIcon from '../../../components/App/HeaderIcon';
import EmptyBackground from '../../../assets/Images/empty_notices.png';

const Notifications = ({ navigation, notifications, resetNotifications }) => {
    const [error, setError] = useState('');

    useLayoutEffect(() => {
        navigation &&
            navigation.setOptions({
                headerRight: () => {
                    if (notifications?.length === 0) return null;
                    else
                        return (
                            <HeaderIcon
                                style={{ width: 60, justifyContent: 'center', marginRight: 15 }}
                                onPress={clearNotifications}>
                                <Text style={styles.clear}>clear all</Text>
                            </HeaderIcon>
                        );
                },
            });
    }, [navigation, notifications]);

    const clearNotifications = () => {
        FirebaseNotification.clearNotifications()
            .then(resetNotifications)
            .catch((error) => FirebaseErrors.setError(error, setError));
    };

    const _emptySection = ({ section }) => {
        if (section.data.length === 0) {
            return <Text style={styles.emptySectionFooter}>no {section.title} notifications</Text>;
        } else return null;
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <Text style={styles.title}>notifications ✨</Text>
            {notifications?.length === 0 ? (
                <View style={{ flex: 1 }}>
                    <FastImage source={EmptyBackground} resizeMode={FastImage.resizeMode.contain} style={{ height: 300 }} />
                    <Text style={styles.noNoticeTitle}>no notifications yet</Text>
                    <Text style={styles.noNoticeSubtitle}>we'll let you know as soon as something important comes up ❤️</Text>
                </View>
            ) : (
                <SectionList
                    sections={[
                        {
                            key: 'new',
                            title: 'new',
                            data: notifications.filter((n) => {
                                if (!n.created_at) return false;
                                const WITHIN_TODAY = 60 * 60 * 24 * 1000;
                                const NOTIFICATION_TIMESTAMP = n.created_at?.toDate
                                    ? n.created_at.toDate()
                                    : new firestore.Timestamp(n.created_at.seconds, n.created_at.nanoseconds);
                                return new Date() - NOTIFICATION_TIMESTAMP < WITHIN_TODAY;
                            }),
                            keyExtractor: (item) => item.id,
                            renderItem: ({ item }) => (
                                <NotificationTab navigation={navigation} notification={item} setError={setError} />
                            ),
                        },
                        {
                            key: 'previous',
                            title: 'previous',
                            data: notifications.filter((n) => {
                                if (!n.created_at) return false;
                                const WITHIN_TODAY = 60 * 60 * 24 * 1000;
                                const NOTIFICATION_TIMESTAMP = n.created_at?.toDate
                                    ? n.created_at.toDate()
                                    : new firestore.Timestamp(n.created_at.seconds, n.created_at.nanoseconds);
                                return new Date() - NOTIFICATION_TIMESTAMP > WITHIN_TODAY;
                            }),
                            keyExtractor: (item) => item.id,
                            renderItem: ({ item }) => (
                                <NotificationTab navigation={navigation} notification={item} setError={setError} />
                            ),
                        },
                    ]}
                    renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                    renderSectionFooter={_emptySection}
                    stickySectionHeadersEnabled={false}
                />
            )}
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    notifications: state.notification.notifications,
});

const mapDispatchToProps = {
    resetNotifications,
};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

const styles = StyleSheet.create({
    clear: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.PRIMARY_COLOR,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 30,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
        color: colors.DARK_GREY,
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    noNoticeTitle: {
        fontFamily: fonts.NEWYORKEXTRALARGE_MEDIUM,
        fontSize: 24,
        textAlign: 'center',
        paddingBottom: 20,
    },
    noNoticeSubtitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    emptySectionFooter: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
    },
});
