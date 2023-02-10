import React, { useState, useEffect } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Image, FlatList } from 'react-native';
import { connect } from 'react-redux';
import GlobalStyles from '../../../constants/globalStyles';
import { fonts, emoji } from '../../../constants';
import { USER_PROFILE } from '../../../navigator/constants';
import User from '../../../service/firebase_requests/User';
import FirebaseError from '../../../service/firebase_errors';
import EmptyBackground from '../../../assets/Images/Profile/blocklist_background.png';
import BlockButton from '../../../assets/Images/Profile/block_button.svg';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import Toast from '../../../components/Toast';
import UserTab from '../../../components/UserTab';

const BlocklistUser = ({ navigation, userID, setError, setLoading }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = User.retrieveUserById(userID, handleUserSnapshot, setError);
        return unsubscribe;
    }, [userID, handleUserSnapshot, setError]);

    const handleUserSnapshot = (snapshot) => {
        setUser({ uid: snapshot.id, ...snapshot.data() });
    };

    const unblockUser = () => {
        setLoading(true);
        userID &&
            User.unblockUserById(userID)
                .catch((err) => FirebaseError.setError(err, setError))
                .finally(() => setLoading(false));
    };

    const navigateToUserProfile = () => {
        return userID && navigation.push(USER_PROFILE, { userID });
    };

    if (!user) return null;

    return (
        <UserTab
            user={user}
            icon={<BlockButton />}
            disabled={loading}
            onPress={navigateToUserProfile}
            iconOnPress={unblockUser}
        />
    );
};

const Blocklist = ({ user, navigation, blocked }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    if (blocked.length === 0)
        return (
            <SafeAreaView style={GlobalStyles.alignCenterContainer}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <Image source={EmptyBackground} resizeMode="contain" style={styles.emptyBackground} />
                <Text style={styles.emptyTitle}>you have not blocked any users</Text>
                <Text style={styles.emptySubtitle}>{`becky with the good hair isn't on the app yet ${emoji.wink}`}</Text>
            </SafeAreaView>
        );

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <FlatList
                data={blocked}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <BlocklistUser
                        navigation={navigation}
                        userID={item.uid}
                        setError={setError}
                        loading={loading}
                        setLoading={setLoading}
                    />
                )}
            />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
    blocked: state.auth.blocked,
});

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(Blocklist);

const styles = StyleSheet.create({
    emptyBackground: {
        flex: 1,
    },
    emptyTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        paddingHorizontal: 80,
        paddingVertical: 30,
        textAlign: 'center',
    },
    emptySubtitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        paddingHorizontal: 80,
        marginBottom: 80,
        textAlign: 'center',
    },
    userContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 15,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    nameContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        marginHorizontal: 10,
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    username: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
    },
    blockButton: {
        width: 50,
        height: 50,
    },
});
