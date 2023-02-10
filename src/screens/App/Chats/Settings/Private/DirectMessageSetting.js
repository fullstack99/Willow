import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, ScrollView, SafeAreaView, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector } from 'react-redux';
import moment from 'moment';
import FastImage from 'react-native-fast-image';
import GlobalStyles from '../../../../../constants/globalStyles';
import { colors, fonts } from '../../../../../constants';
import * as NAVIGATOR_CONSTANTS from '../../../../../navigator/constants';
import SettingMuteSvg from '../../../../../assets/Images/setting-mute.svg';
import SettingUnMuteSvg from '../../../../../assets/Images/un-mute.svg';
import FirebaseChat from '../../../../../service/firebase_requests/Chat';
import FirebaseErrors from '../../../../../service/firebase_errors';
import Toast from '../../../../../components/Toast';
import MediaSection from '../../../../../components/Chat/Setting/MediaSection';

const { height, width } = Dimensions.get('window');

const DirectMessageSetting = ({ navigation, route }) => {
    const { room, user } = route.params;
    const currentUser = useSelector((state) => state.auth.user);
    const [error, setError] = useState('');
    const [memberStatus, setMemberStatus] = useState(null);
    const [muted, setMuted] = useState(room?.muted.indexOf(currentUser?.uid) !== -1 || false);
    if (!room || !user)
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
            </SafeAreaView>
        );
    const toggleMuteDirectMessage = () => {
        FirebaseChat.muteChatRoom(room.id, !muted)
            .then(() => setMuted(!muted))
            .catch((error) => FirebaseErrors.setError(error, setError));
    };

    const options = [
        {
            key: 'mute',
            title: muted ? 'unmute' : 'mute',
            icon: (
                <TouchableOpacity onPress={toggleMuteDirectMessage}>
                    {muted ? <SettingMuteSvg /> : <SettingUnMuteSvg />}
                </TouchableOpacity>
            ),
        },
    ];

    useEffect(() => {
        FirebaseChat.getChatMemberStatus(room.id, user.uid)
            .then(setMemberStatus)
            .catch((error) => FirebaseErrors.setError(error, setError));
    }, [room?.id, user?.uid]);

    const _navigateToUser = () => {
        return navigation && navigation.push(NAVIGATOR_CONSTANTS.USER_PROFILE, { userID: user.uid });
    };

    const _renderLastSeen = () => {
        if (!memberStatus?.last_seen || !memberStatus.last_seen?.toDate) return null;
        else {
            return <Text style={styles.last_seen}>{`last seen ${moment(memberStatus.last_seen.toDate()).fromNow()}`}</Text>;
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <ScrollView>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <View style={styles.container}>
                    <View style={styles.userContainer}>
                        <TouchableOpacity onPress={_navigateToUser}>
                            <FastImage
                                source={{ uri: user?.avatar_url }}
                                style={styles.avatar}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                        </TouchableOpacity>
                        <Text style={styles.name}>{user?.name}</Text>
                        {_renderLastSeen()}
                    </View>
                    <View style={styles.optionsContainer}>
                        {options.map((o) => (
                            <View key={o.key} style={{ alignItems: 'center' }}>
                                {o.icon}
                                <Text style={styles.option}>{o.title}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <MediaSection navigation={navigation} room={room} />
            </ScrollView>
        </SafeAreaView>
    );
};

export default DirectMessageSetting;

const styles = StyleSheet.create({
    container: {
        margin: 20,
        alignItems: 'center',
    },
    userContainer: {
        marginBottom: 20,
        alignItems: 'center',
    },
    avatar: {
        width: height * 0.18,
        height: height * 0.18,
        borderRadius: (height * 0.18) / 2,
    },
    name: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        paddingTop: 20,
    },
    last_seen: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.GREY_2,
        paddingTop: 5,
    },
    optionsContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'space-evenly',
    },
    option: {
        paddingTop: 10,
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
    },
});
