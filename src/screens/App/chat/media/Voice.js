import React, { useEffect, useState } from 'react';
import { FlatList, ActivityIndicator, SafeAreaView, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import SoundPlayer from 'react-native-sound-player';
import { Player } from '@react-native-community/audio-toolkit';

import { colors, fonts } from '../../../../constants';
import VoiceListItem from '../../../../components/Chat/Media/VoiceListItem';
import Chat from '../../../../service/firebase_requests/Chat';
import LoadingDotsOverlay from '../../../../components/LoadingDotsOverlay';

const Voice = ({ show }) => {
    const [audioList, setAudioList] = useState([]);
    const [loading, setLoading] = useState(false);
    const { currentGroup } = useSelector((state) => state.chats);

    useEffect(() => {
        if (currentGroup && show) {
            setLoading(true);
            Chat.getAllAudio(currentGroup.id)
                .then((res) => {
                    setAudioList(res._items);
                    setLoading(false);
                })
                .catch((error) => {
                    setLoading(false);
                    console.log('get media error', error);
                });
        }
    }, [show]);

    useEffect(() => {
        const _onFinishedPlayingSubscription = SoundPlayer.addEventListener('FinishedPlaying', ({ success }) => {
            console.log('finished playing', success);
        });
        const _onFinishedLoadingSubscription = SoundPlayer.addEventListener('FinishedLoading', ({ success }) => {
            console.log('finished loading', success);
        });
        const _onFinishedLoadingFileSubscription = SoundPlayer.addEventListener(
            'FinishedLoadingFile',
            ({ success, name, type }) => {
                console.log('finished loading file', success, name, type);
            },
        );
        const _onFinishedLoadingURLSubscription = SoundPlayer.addEventListener('FinishedLoadingURL', ({ success, url }) => {
            console.log('finished loading url', success, url);
        });
        return () => {
            _onFinishedPlayingSubscription.remove();
            _onFinishedLoadingSubscription.remove();
            _onFinishedLoadingURLSubscription.remove();
            _onFinishedLoadingFileSubscription.remove();
        };
    }, []);

    const onPressPlayButton = (link) => {
        try {
            SoundPlayer.playUrl(link);
        } catch (e) {
            console.log('cannot play the sound file', e);
        }
    };

    if (!show) {
        return null;
    }
    return (
        <SafeAreaView style={styles.container}>
            <LoadingDotsOverlay animation={loading} />
            <FlatList
                data={audioList}
                renderItem={({ item }) => <VoiceListItem item={item} onPress={onPressPlayButton} />}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                style={styles.list}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
        marginTop: 30,
    },
    top: {
        backgroundColor: colors.WHITE,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    newGroup: {
        marginTop: 30,
    },
    rowOpen: {
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
    },
    rowBack: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingVertical: 10,
    },
    typeView: {
        marginVertical: 20,
        paddingLeft: 30,
    },
    text: {
        fontSize: 13,
        fontFamily: fonts.MULISH_REGULAR,
        color: colors.GREY_1,
    },
});
export default Voice;
