import React, { useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import { connect, useDispatch, useSelector } from 'react-redux';
import branch from 'react-native-branch';
import Share from 'react-native-share';
import { fonts, colors } from '../../../constants';
import GlobalStyles from '../../../constants/globalStyles';
import * as NAVIGATOR_CONSTANTS from '../../../navigator/constants';
import { signOut, resetUser } from '../../../actions/authActions';
import { CommonActions } from '@react-navigation/native';
import FirebaseErrors from '../../../service/firebase_errors';
import User from '../../../service/firebase_requests/User';
import FontAwesomeIcon from 'react-native-vector-icons/FontAwesome';
import AccountIcon from '../../../assets/Images/Profile/profile.svg';
import NotificationIcon from '../../../assets/Images/Profile/notification.svg';
import ShareIcon from '../../../assets/Images/Profile/share.svg';
import SupportIcon from '../../../assets/Images/Profile/support.svg';
import BlocklistIcon from '../../../assets/Images/Profile/blocklist.svg';
import SavedIcon from '../../../assets/Images/Profile/saved.svg';
import StatusIcon from '../../../assets/Images/Profile/status.svg';
import FeedbackIcon from '../../../assets/Images/Profile/feedback.svg';
import Toast from '../../../components/Toast';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import ShareDialog from '../../../components/Dialogs/ShareDialog';
import { discardAlert } from '../../../utility';
const { scale } = Dimensions.get('window');

const SettingTab = ({ item, loading }) => {
    return (
        <TouchableOpacity style={styles.tab} onPress={item.onPress} disabled={loading}>
            {item.icon}
            <Text style={styles.tabTitle}>{item.title}</Text>
            <FontAwesomeIcon name={'angle-right'} color={colors.PRIMARY_COLOR} size={20} />
        </TouchableOpacity>
    );
};

const Settings = ({ navigation, signOut, resetUser }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const user = useSelector((state) => state.auth.user);
    const shareDialogRef = useRef();
    const dispatch = useDispatch();
    const LINK_TITLE = 'join me on willow';
    const LINK_DESCRIPTION = `Hey, would you like to try out our new app? It's Willow time!`;
    const TITLE = 'Check out Willow Parenting';
    const MESSAGE =
        'parenting takes a village! join me on the willow community where we can chat and share all things kiddo. download the free app using my link:';

    const settingsTab = [
        {
            key: 'account',
            title: 'account',
            icon: <AccountIcon width={styles.tabIcon.width} height={styles.tabIcon.height} />,
            onPress: () => navigation && navigation.navigate(NAVIGATOR_CONSTANTS.ACCOUNT),
        },
        {
            key: 'status',
            title: 'status',
            icon: (
                <TouchableOpacity
                    style={{
                        width: scale > 1 ? 50 : 40,
                        height: scale > 1 ? 50 : 40,
                        borderRadius: scale > 1 ? 50 / 2 : 40 / 2,
                        textAlign: 'center',
                        backgroundColor: colors.GREY,
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <StatusIcon width={22} height={22} style={{ backgroundColor: 'transparent' }} />
                </TouchableOpacity>
            ),
            onPress: () => navigation && navigation.navigate(NAVIGATOR_CONSTANTS.STATUS),
        },
        {
            key: 'notifications',
            title: 'notifications',
            icon: <NotificationIcon width={styles.tabIcon.width} height={styles.tabIcon.height} />,
            onPress: () => navigation && navigation.navigate(NAVIGATOR_CONSTANTS.NOTIFICATION_SETTINGS),
        },
        {
            key: 'bookmarked',
            title: 'bookmarked',
            icon: <SavedIcon width={styles.tabIcon.width} height={styles.tabIcon.height} />,
            onPress: () => navigation && navigation.navigate(NAVIGATOR_CONSTANTS.BOOKMARKED),
        },
        {
            key: 'blocklist',
            title: 'blocked',
            icon: <BlocklistIcon width={styles.tabIcon.width} height={styles.tabIcon.height} />,
            onPress: () => navigation && navigation.navigate(NAVIGATOR_CONSTANTS.BLOCKLIST),
        },
        {
            key: 'support',
            title: 'support',
            icon: <SupportIcon width={styles.tabIcon.width} height={styles.tabIcon.height} />,
            onPress: () => navigation && navigation.navigate(NAVIGATOR_CONSTANTS.SUPPORT),
        },
        {
            key: 'share',
            title: 'share',
            icon: <ShareIcon width={styles.tabIcon.width} height={styles.tabIcon.height} />,
            onPress: () => shareDialogRef.current && shareDialogRef.current.open(),
        },
        {
            key: 'feedback',
            title: 'feedback',
            icon: <FeedbackIcon width={styles.tabIcon.width} height={styles.tabIcon.height} />,
            onPress: () =>
                navigation &&
                navigation.navigate(NAVIGATOR_CONSTANTS.WEBVIEW, { uri: 'http://www.willow.app/feedback', title: 'feedback' }),
        },
    ];

    const onSignOutPress = () => {
        const signOutOnPress = () => {
            return new Promise((resolve, reject) => {
                setLoading(true);
                signOut()
                    .then(() => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 0,
                                routes: [{ name: NAVIGATOR_CONSTANTS.START_UP }],
                            }),
                        );
                        resolve();
                    })
                    .catch((error) => {
                        resolve(FirebaseErrors.setError(error, setError));
                    })
                    .finally(() => setLoading(false));
            });
        };
        if (signOut) {
            discardAlert(signOutOnPress, 'Log Out', 'Are you sure you want to log out?', 'Log Out', 'Cancel');
        }
    };

    const onDeletePress = () => {
        try {
            if (resetUser) {
                discardAlert(deleteUser, 'Delete Account', 'Are you sure you want to delete your account?', 'Delete', 'Cancel');
            }
        } catch (error) {
            return FirebaseErrors.setError(error, setError);
        }
    };

    const deleteUser = () => {
        setTimeout(() => {
            setLoading(true);
            User.deleteAccount()
                .then(() => {
                    setLoading(false);
                    return navigation.navigate(NAVIGATOR_CONSTANTS.START_UP);
                })
                .catch((error) => {
                    setLoading(false);
                    return FirebaseErrors.setError(error, setError);
                });
        }, 500);
    };

    const closeShareDialog = () =>
        shareDialogRef.current && shareDialogRef.current.state.modalVisible && shareDialogRef.current.close();

    const onQRCodePress = () => {
        closeShareDialog();
        navigation && navigation.navigate(NAVIGATOR_CONSTANTS.SHARE);
    };

    const onMessagePress = () => {
        closeShareDialog();
        setTimeout(() => {
            branch
                .createBranchUniversalObject('sharingWillowParenting', {
                    locallyIndex: true,
                    title: LINK_TITLE,
                    contentDescription: LINK_DESCRIPTION,
                })
                .then((branchObject) => {
                    if (branchObject) {
                        const linkProperties = {
                            feature: 'share',
                            channel: 'facebook',
                        };
                        const controlParams = {
                            $desktop_url: 'https://www.willow.app',
                            data: {
                                user: user?.uid,
                            },
                        };
                        branchObject.generateShortUrl(linkProperties, controlParams).then(({ url }) => {
                            Share.open({
                                title: TITLE,
                                message: `${MESSAGE} ${url}`,
                            }).catch(console.log);
                        });
                    }
                })
                .catch(console.log);
        }, 500);
    };

    const onMailPress = () => {
        closeShareDialog();
        setTimeout(() => {
            branch
                .createBranchUniversalObject('sharingWillowParenting', {
                    locallyIndex: true,
                    title: LINK_TITLE,
                    contentDescription: LINK_DESCRIPTION,
                })
                .then((branchObject) => {
                    if (branchObject) {
                        const linkProperties = {
                            feature: 'share',
                            channel: 'facebook',
                        };
                        const controlParams = {
                            $desktop_url: 'https://www.willow.app',
                            data: {
                                user: user?.uid,
                            },
                        };
                        branchObject.generateShortUrl(linkProperties, controlParams).then(({ url }) => {
                            Share.shareSingle({
                                subject: TITLE,
                                message: `${MESSAGE} ${url}`,
                                social: Share.Social.EMAIL,
                            }).catch(console.log);
                        });
                    }
                })
                .catch(console.log);
        }, 500);
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <FlatList
                data={settingsTab}
                keyExtractor={(item) => item.key}
                renderItem={({ item }) => <SettingTab item={item} loading={loading} />}
                bounces={false}
                style={{ backgroundColor: colors.WHITE }}
                contentContainerStyle={{ flexGrow: 1 }}
                ListFooterComponentStyle={{ flex: 1, justifyContent: 'flex-end' }}
                ListFooterComponent={() => (
                    <View style={styles.footerContainer}>
                        <TouchableOpacity disabled={loading} onPress={onSignOutPress}>
                            <Text style={styles.footerTitle}>log out</Text>
                        </TouchableOpacity>
                        {/* <TouchableOpacity disabled={loading} onPress={onDeletePress}>
                            <Text style={styles.footerTitle}>delete account</Text>
                        </TouchableOpacity> */}
                    </View>
                )}
            />
            <ShareDialog
                forwardRef={shareDialogRef}
                navigation={navigation}
                onQRCodePress={onQRCodePress}
                onMessagePress={onMessagePress}
                onMailPress={onMailPress}
            />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    signOut,
    resetUser,
};

export default connect(mapStateToProps, mapDispatchToProps)(Settings);

const styles = StyleSheet.create({
    tab: {
        flexDirection: 'row',
        paddingVertical: 10,
        alignItems: 'center',
        marginHorizontal: 20,
    },
    tabIcon: {
        width: scale > 1 ? 50 : 40,
        height: scale > 1 ? 50 : 40,
        textAlign: 'center',
    },
    tabTitle: {
        flex: 1,
        paddingHorizontal: 15,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
    },
    footerContainer: {
        margin: 20,
    },
    footerTitle: {
        fontFamily: fonts.MULISH_SEMIBOLD,
        fontSize: 16,
        color: '#FF5A61',
        paddingVertical: 10,
    },
});
