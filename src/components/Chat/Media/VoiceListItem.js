import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import SoundPlayer from 'react-native-sound-player';
import moment from 'moment';

import { colors, fonts } from '../../../constants';
import UserService from '../../../service/firebase_requests/User';
import PlayerSvg from '../../../assets/Images/player.svg';

const VoiceListItem = ({ item, onPress }) => {
    const [user, setUser] = useState(null);
    const [audioInfo, setAudioInfo] = useState(null);
    const [postedDate, setPostedDate] = useState();

    useEffect(() => {
        const temp = item?.path.split('%2F')[3].split('-');
        setPostedDate(new Date(parseInt(temp[1])));
        getInfo(item?.path);
        const handleUserSnapshot = (snapshot) => {
            setUser({ uid: snapshot.id, ...snapshot.data() });
        };
        const unsubscribe = UserService.retrieveUserById(temp[0], handleUserSnapshot, (message) => {
            console.log(message);
        });
        return () => {
            unsubscribe;
        };
    }, [item]);

    const getInfo = async (link) => {
        try {
            const info = await SoundPlayer.getInfo(link);
            setAudioInfo(info);
        } catch (e) {
            console.log('There is no song playing', e);
        }
    };

    return (
        <TouchableOpacity style={styles.container}>
            <View style={styles.videoView}>
                <PlayerSvg onPress={() => onPress && onPress(item.path)} />
                <View style={styles.videoInfo}>
                    <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                        {user?.name}
                    </Text>
                    <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                        {moment(postedDate).format('MMM DD, YYYY, HH:mm')}
                    </Text>
                </View>
            </View>
            {/* <Text style={styles.text}>{audioInfo?.duration.toString().toFxied(2)}</Text> */}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    },
    videoInfo: {
        width: '70%',
        marginLeft: 10,
    },
    videoView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
    text: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.GREY_2,
        marginTop: 3,
    },
});
export default VoiceListItem;
