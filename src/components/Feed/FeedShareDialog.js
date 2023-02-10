import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import branch from 'react-native-branch';
import RBSheet from 'react-native-raw-bottom-sheet';
import Share from 'react-native-share';
import CustomFastImage from '../App/CustomFastImage';
import { fonts, colors } from '../../constants';
import { SHARE_IN_WILLOW } from '../../navigator/constants';
import { TIPS, REVIEWS, QUESTIONS } from '../../constants/Database';
import MessageIcon from '../../assets/Images/iMessage-icon.svg';
import WillowIcon from '../../assets/Images/willow-icon.png';

const FeedShareDialog = ({ forwardRef, privateContentRef, navigation, data, author, setError, openAuthDialog }) => {
    const insets = useSafeAreaInsets();
    const user = useSelector((state) => state.auth.user);
    const LINK_TITLE = 'check this out';
    const closeDialog = () => forwardRef && forwardRef.current.close();

    const onMessagePress = () => {
        closeDialog();
        setTimeout(() => {
            branch
                .createBranchUniversalObject(data.id, {
                    locallyIndex: true,
                    title: LINK_TITLE,
                    contentDescription: data.title,
                })
                .then((branchObject) => {
                    if (branchObject) {
                        const linkProperties = {
                            feature: 'share',
                            channel: 'facebook',
                        };
                        const controlParams = {
                            $desktop_url: 'https://www.willow.app',
                            $canonical_identifier: data.id,
                            data: {
                                id: data.id,
                                type: data.type,
                            },
                        };
                        branchObject.generateShortUrl(linkProperties, controlParams).then(({ url }) => {
                            Share.open({
                                title: `check this out`,
                                message: `check out what ${author?.name} posted on willow. it's ${
                                    data.type === TIPS
                                        ? 'a useful tip'
                                        : data.type === REVIEWS
                                        ? 'a thoughtful review'
                                        : 'an interesting question'
                                }! ${url}`,
                            }).catch(console.log);
                        });
                    }
                })
                .catch(console.log);
        }, 500);
    };
    const onWillowPress = () => {
        closeDialog();
        if (!user || !user?.uid) {
            return setTimeout(openAuthDialog, 500);
        } else if (data?.visibility && data?.visibility !== 'everyone') {
            return setTimeout(() => {
                privateContentRef && privateContentRef.current.open();
            }, 500);
        } else {
            return setTimeout(() => navigation && navigation.push(SHARE_IN_WILLOW, { data, author }), 500);
        }
    };
    const options = [
        {
            key: 'message',
            icon: <MessageIcon />,
            label: 'message',
            onPress: onMessagePress,
        },
        {
            key: 'willow',
            icon: <CustomFastImage source={WillowIcon} maxWidth={50} maxHeight={50} borderRadius={50 / 2} />,
            label: 'willow',
            onPress: onWillowPress,
        },
    ];
    return (
        <RBSheet
            ref={forwardRef}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: { ...styles.dialogContainer, paddingBottom: insets.bottom },
            }}>
            <View style={styles.container}>
                <Text style={styles.title}>share via</Text>
                <View style={styles.sectionContainer}>
                    {options.map((option) => (
                        <TouchableOpacity key={option.key} onPress={option.onPress}>
                            <View style={styles.itemContainer}>
                                {option.icon}
                                <Text style={styles.label}>{option.label}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </RBSheet>
    );
};

export default FeedShareDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 200,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        marginBottom: 20,
    },
    sectionContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
        width: '100%',
    },
    itemContainer: {
        alignItems: 'center',
    },
    label: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        paddingTop: 10,
    },
    toastMessageContainer: {
        position: 'absolute',
        zIndex: 100,
        bottom: 30,
        backgroundColor: colors.DARK_GREY,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 5,
        paddingHorizontal: 10,
        borderRadius: 10,
    },
    toastMessage: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.WHITE,
    },
});
