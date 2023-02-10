import React, { useState } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Switch } from 'react-native';
import { connect } from 'react-redux';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import User from '../../../service/firebase_requests/User';
import * as USER_CONSTANTS from '../../../constants/User';
import FirebaseErrors from '../../../service/firebase_errors';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import Toast from '../../../components/Toast';
import globalStyles from '../../../constants/globalStyles';

const Notifications = ({ user, navigation }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const notifications = [
        {
            key: USER_CONSTANTS.NOTIFICATION_FRIEND_REQUEST,
            label: user[USER_CONSTANTS.PRIVACY_PREFERENCE] === 'public' ? 'when followed' : 'friend requests',
        },
        // { key: USER_CONSTANTS.NOTIFICATION_MENTIONS, label: 'when tagged' },
        { key: USER_CONSTANTS.NOTIFICATION_COMMENTS, label: 'comments on your posts' },
        { key: USER_CONSTANTS.NOTIFICATION_REPLIES, label: 'replies to your comments' },
        { key: USER_CONSTANTS.NOTIFICATION_POST, label: 'posts by users you follow' },
    ];

    const setToastError = (error) => {
        setError(FirebaseErrors.checkError(error.code || error));
        setTimeout(() => setError(''), 4000);
    };

    const onValueChange = (key, value) => {
        if (!key || value === undefined) return;
        setLoading(true);
        User.updateUser({ [key]: value })
            .catch(setToastError)
            .finally(() => setLoading(false));
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <LoadingDotsOverlay animation={loading} />
            <View style={globalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            {notifications.map((n) => (
                <View key={n.key} style={styles.row}>
                    <Text style={styles.title}>{n.label}</Text>
                    <Switch
                        trackColor={{ false: colors.GREY, true: colors.PRIMARY_COLOR }}
                        value={user[n.key]}
                        onValueChange={(value) => onValueChange(n.key, value)}
                    />
                </View>
            ))}
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Notifications);

const styles = StyleSheet.create({
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 20,
        marginVertical: 15,
    },
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
});
