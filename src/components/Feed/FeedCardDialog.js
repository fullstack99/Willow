import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import Clipboard from '@react-native-community/clipboard';
import Feather from 'react-native-vector-icons/Feather';
import RBSheet from 'react-native-raw-bottom-sheet';
import CopySvg from '../../assets/Images/copy.svg';
import BookmarkSvg from '../../assets/Images/bookmark.svg';
import UnbookmarkSvg from '../../assets/Images/bookmark-filled.svg';
import ShareSvg from '../../assets/Images/share.svg';
import EditSvg from '../../assets/Images/edit.svg';
import DeleteSvg from '../../assets/Images/delete.svg';
import FirebaseErrors from '../../service/firebase_errors';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import { TIPS, REVIEWS, QUESTIONS } from '../../constants/Database';
import { TIP_INPUT, CREATE_QUESTION, CREATE_REVIEW } from '../../navigator/constants';
import { colors, fonts } from '../../constants';
import { discardAlert } from '../../utility';

const FeedCardDialog = ({ forwardRef, shareDialogRef, navigation, data, setLoading, setError, onDeletePost, openAuthDialog }) => {
    const [bookmark, setBookmark] = useState(null);
    const user = useSelector((state) => state.auth.user);
    useEffect(() => {
        const unsubscribe =
            user?.uid &&
            FirebaseFeed.retrieveFeedBookmarkStatus(
                data.id,
                (querySnapshot) => {
                    if (querySnapshot.size === 1) {
                        setBookmark({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
                    } else {
                        setBookmark(null);
                    }
                },
                (error) => FirebaseErrors.setError(error, setError),
            );

        return () => unsubscribe && typeof unsubscribe === 'function' && unsubscribe();
    }, [user, data?.id]);
    const closeSetting = () => forwardRef.current && forwardRef.current.close();
    const settingOptions = [
        {
            key: 'copy',
            name: 'copy',
            icon: <CopySvg width={25} height={25} style={styles.settingDialogIcon} />,
            onPress: () => {
                Clipboard.setString(data.title || data.question || '');
                closeSetting();
            },
        },
        {
            key: 'bookmark',
            name: bookmark ? 'unbookmark' : 'bookmark',
            icon: bookmark ? (
                <UnbookmarkSvg width={25} height={25} style={styles.settingDialogIcon} />
            ) : (
                <BookmarkSvg width={25} height={25} style={styles.settingDialogIcon} />
            ),
            onPress: () => {
                closeSetting();
                if (!user || !user.uid) {
                    setTimeout(() => openAuthDialog && openAuthDialog(), 500);
                } else if (bookmark) {
                    FirebaseFeed.unbookmark(data.id, bookmark.id).catch((error) => FirebaseErrors.setError(error, setError));
                } else {
                    FirebaseFeed.bookmark(data).catch((error) => FirebaseErrors.setError(error, setError));
                }
            },
        },
        {
            key: 'share',
            name: 'share post',
            icon: <ShareSvg height={25} width={25} style={styles.settingDialogIcon} />,
            onPress: () => {
                closeSetting();
                setTimeout(() => shareDialogRef && shareDialogRef.current.open(), 500);
            },
        },
        {
            key: 'report',
            name: 'report post',
            icon: <Feather name={'flag'} size={25} style={[styles.settingDialogIcon, { color: colors.RED }]} />,
            color: colors.RED,
            onPress: () => {
                closeSetting();
                if (!user || !user.uid) {
                    setTimeout(() => openAuthDialog && openAuthDialog(), 500);
                } else {
                    setTimeout(
                        () =>
                            discardAlert(
                                () => {
                                    setLoading(true);
                                    FirebaseFeed.reportFeed(data)
                                        .then(onDeletePost)
                                        .catch((error) => FirebaseErrors.setError(error, setError))
                                        .finally(() => setLoading(false));
                                },
                                'Report',
                                'Are you sure you want to report this post?',
                                'Report',
                                'Cancel',
                            ),
                        500,
                    );
                }
            },
        },
    ];

    const currentUserSettingOptions = [
        {
            key: 'edit',
            name: 'edit post',
            icon: <EditSvg width={25} height={25} style={styles.settingDialogIcon} />,
            onPress: () => {
                closeSetting();
                switch (data.type) {
                    case TIPS:
                        return navigation && navigation.navigate(TIP_INPUT, { tip: data });
                    case REVIEWS:
                        return navigation && navigation.navigate(CREATE_REVIEW, { review: data });
                    case QUESTIONS:
                        return navigation && navigation.navigate(CREATE_QUESTION, { question: data });
                    default:
                        return console.log('invalid feed type');
                }
            },
        },
        {
            key: 'share',
            name: 'share post',
            icon: <ShareSvg height={25} width={25} style={styles.settingDialogIcon} />,
            onPress: () => {
                closeSetting();
                setTimeout(() => shareDialogRef && shareDialogRef.current.open(), 500);
            },
        },
        {
            key: 'delete',
            name: 'delete post',
            icon: <DeleteSvg height={25} width={25} style={[styles.settingDialogIcon, { color: colors.RED }]} />,
            color: colors.RED,
            onPress: () => {
                closeSetting();
                setTimeout(
                    () =>
                        discardAlert(
                            () => {
                                setLoading(true);
                                FirebaseFeed.deleteFeed(data)
                                    .then(onDeletePost)
                                    .catch((error) => FirebaseErrors.setError(error, setError))
                                    .finally(() => setLoading(false));
                            },
                            'Delete',
                            'Are you sure you want to delete this post?',
                            'Delete',
                            'Cancel',
                        ),
                    500,
                );
            },
        },
    ];

    if (data?.author === user?.uid) {
        return (
            <RBSheet
                ref={forwardRef}
                height={Dimensions.get('window').height * 0.4}
                animationType="slide"
                closeOnDragDown
                openDuration={300}
                customStyles={{
                    container: styles.settingDialogContainer,
                }}>
                <View style={styles.settingDialog}>
                    {currentUserSettingOptions.map((option) => (
                        <TouchableOpacity key={option.key} onPress={option.onPress} style={styles.settingDialogItem}>
                            {option.icon}
                            <View style={styles.settingDialogIconShadow} />
                            <Text style={[styles.settingDialogItemText, { color: option.color }]}>{option.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </RBSheet>
        );
    } else {
        return (
            <RBSheet
                ref={forwardRef}
                height={Dimensions.get('window').height * 0.4}
                animationType="slide"
                closeOnDragDown
                openDuration={300}
                customStyles={{
                    container: styles.settingDialogContainer,
                }}>
                <View style={styles.settingDialog}>
                    {settingOptions.map((option) => (
                        <TouchableOpacity key={option.key} onPress={option.onPress} style={styles.settingDialogItem}>
                            {option.icon}
                            <View style={styles.settingDialogIconShadow} />
                            <Text style={[styles.settingDialogItemText, { color: option.color }]}>{option.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>
            </RBSheet>
        );
    }
};

FeedCardDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
    data: PropTypes.shape({ id: PropTypes.string.isRequired }).isRequired,
    user: PropTypes.object,
    setLoading: PropTypes.func.isRequired,
    setError: PropTypes.func.isRequired,
    onDeletePost: PropTypes.func.isRequired,
    openAuthDialog: PropTypes.func.isRequired,
};

export default FeedCardDialog;

const styles = StyleSheet.create({
    settingDialog: {
        justifyContent: 'space-evenly',
        height: '85%',
        paddingLeft: 20,
    },
    settingDialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    settingDialogItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 10,
    },
    settingDialogIcon: {
        marginHorizontal: 30,
        zIndex: 999,
    },
    settingDialogIconShadow: {
        position: 'absolute',
        backgroundColor: colors.GREY,
        left: 35 - 35 / 2,
        height: 50,
        width: 50,
        borderRadius: 50 / 2,
    },
    settingDialogItemText: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
    },
});
