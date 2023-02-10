import React from 'react';
import { StyleSheet, Text, View, Dimensions, Switch, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import Anonymous from '../../assets/Images/anonymous.svg';
import EveryoneTrue from '../../assets/Images/Create/everyone-true.svg';
import EveryoneFalse from '../../assets/Images/Create/everyone-false.svg';
import FollowersTrue from '../../assets/Images/Create/followers-true.svg';
import FollowersFalse from '../../assets/Images/Create/followers-false.svg';
import FriendsTrue from '../../assets/Images/Create/friends-true.svg';
import FriendsFalse from '../../assets/Images/Create/friends-false.svg';
const { height, width } = Dimensions.get('window');

const VisibilityDialog = ({ forwardRef, userAvatar, anonymous, setAnonymous, visibility, setVisibility }) => {
    if (!forwardRef) return null;
    const insets = useSafeAreaInsets();

    const visibilitySelections = [
        {
            key: 'everyone',
            label: 'everyone',
            icon: visibility === 'everyone' ? <EveryoneTrue width={40} height={40} /> : <EveryoneFalse width={40} height={40} />,
            onPress: () => setVisibility('everyone'),
        },
        {
            key: 'followers',
            label: 'followers',
            icon:
                visibility === 'followers' ? (
                    <FollowersTrue width={40} height={40} />
                ) : (
                    <FollowersFalse width={40} height={40} style={{ opacity: anonymous ? 0.5 : 1 }} />
                ),
            onPress: () => setVisibility('followers'),
        },
        {
            key: 'friends',
            label: 'friends only',
            icon:
                visibility === 'friends' ? (
                    <FriendsTrue width={40} height={40} />
                ) : (
                    <FriendsFalse width={40} height={40} style={{ opacity: anonymous ? 0.5 : 1 }} />
                ),
            onPress: () => setVisibility('friends'),
        },
    ];

    return (
        <RBSheet
            ref={forwardRef}
            height={setAnonymous ? height * 0.5 : height * 0.4}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <View style={[GlobalStyles.alignCenterContainer, { marginBottom: insets.bottom + 20 }]}>
                <Text style={styles.title}>visibility preference</Text>

                {setAnonymous && (
                    <View style={[styles.container, { marginBottom: 15 }]}>
                        {anonymous ? (
                            <Anonymous style={styles.anonymous} />
                        ) : (
                            <FastImage source={{ uri: userAvatar }} resizeMode="contain" style={styles.avatar} />
                        )}
                        <Text style={styles.subTitle}>post anonymously?</Text>
                        <Switch
                            trackColor={{ false: colors.GREY, true: colors.PRIMARY_COLOR }}
                            onValueChange={() => {
                                setAnonymous(!anonymous);
                                if (!anonymous) {
                                    setVisibility('everyone');
                                }
                            }}
                            value={anonymous}
                        />
                    </View>
                )}

                {visibilitySelections.map((v) => {
                    return (
                        <TouchableOpacity
                            key={v.key}
                            style={[styles.container, { marginVertical: 10 }]}
                            disabled={anonymous && v.key !== 'everyone'}
                            onPress={v.onPress}>
                            {v.icon}
                            <Text style={[styles.subTitle, { opacity: anonymous && v.key !== 'everyone' ? 0.5 : 1 }]}>
                                {v.label}
                            </Text>
                        </TouchableOpacity>
                    );
                })}

                <View></View>
            </View>
        </RBSheet>
    );
};

VisibilityDialog.propTypes = {
    forwardRef: PropTypes.object.isRequired,
    anonymous: PropTypes.bool,
    setAnonymous: PropTypes.func,
};

export default VisibilityDialog;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        marginVertical: 20,
    },
    container: {
        flexDirection: 'row',
        marginHorizontal: 30,
        alignItems: 'center',
    },
    anonymous: {
        transform: [{ rotate: '180deg' }],
        width: 40,
        height: 40,
    },
    avatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
    },
    subTitle: {
        flex: 1,
        marginLeft: 15,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
});
