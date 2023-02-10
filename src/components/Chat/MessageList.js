import React, { useEffect, useState, useRef } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    KeyboardAvoidingView,
    RefreshControl,
    Keyboard,
    Dimensions,
    TouchableOpacity,
    Platform,
    Modal,
    SafeAreaView,
    PermissionsAndroid,
    Alert,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { Player } from '@react-native-community/audio-toolkit';
import ImageViewer from 'react-native-image-zoom-viewer';
import DoubleTap from 'react-native-double-tap';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';
import CameraRoll from '@react-native-community/cameraroll';
import WaveForm from 'react-native-audiowaveform';
import RNFetchBlob from 'rn-fetch-blob';
import moment from 'moment';

import { colors, fonts } from '../../constants';
import { USER_PROFILE } from '../../navigator/constants';
import Chat from '../../service/firebase_requests/Chat';
import VotedMembersDialog from './VotedMembersDialog';
import LikedMembersDialog from './LikedMembersDialog';
import StarSvg from '../../assets/Images/star.svg';
import LoadingDotsOverlay from '../../components/LoadingDotsOverlay';
import PlayerSvg from '../../assets/Images/player.svg';
import PauseSvg from '../../assets/Images/pause.svg';
const { width } = Dimensions.get('screen');

const MessageList = ({
    messages,
    chatListRef,
    scrollToEnd,
    handleReply,
    showMessageActionsDialog,
    onloadMoreMessages,
    refresh,
    isFirstLoading,
    navigation,
    handleLikeMessage,
    handleVote,
    handleRetractVote,
    showPollDialog,
}) => {
    const [galleryList, setGalleryList] = useState([]);
    const [visible, setModalVisible] = useState(false);
    const [imagePath, setImagePath] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);
    const [votedMembers, setVotedMembers] = useState([]);
    const [likedMembers, setLikedMembers] = useState([]);
    const [selectedType, setSelectedType] = useState('all');
    const [selectedAudio, setSelectedAudio] = useState({});
    const { user } = useSelector((state) => state.auth);
    const { currentGroup } = useSelector((state) => state.chats);
    const votedMembersDialogRef = useRef();
    const likedMembersDialogRef = useRef();

    useEffect(() => {
        if (currentGroup) {
            Chat.getAllMedia(currentGroup.id)
                .then((res) => {
                    const temp = res?._items.map((v) => {
                        return {
                            url: v?.path,
                        };
                    });
                    setGalleryList(temp);
                })
                .catch((error) => {
                    console.log('get media error', error);
                });
        }
    }, []);

    const _renderItem = ({ item }) => {
        return item.senderId === user.uid ? _renderSenderView(item) : _renderReceiverView(item);
    };

    const _onScrollBeginDrag = () => {};

    const _onScrollEndDrag = () => {};

    const handleToggleAudio = (id) => {
        const temp = { ...selectedAudio };
        temp[id] = !temp[id];
        setSelectedAudio(temp);
    };

    const handleStopAudio = (id) => {
        const temp = { ...selectedAudio };
        temp[id] = false;
        setSelectedAudio(temp);
    };

    const getPermissionAndroid = async () => {
        try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE, {
                title: 'Image Download Permission',
                message: 'Your permission is required to save images to your device',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            });
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                return true;
            }
            Alert.alert(
                'Save remote Image',
                'Grant Me Permission to save Image',
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        } catch (err) {
            Alert.alert(
                'Save remote Image',
                'Failed to save Image: ' + err.message,
                [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                { cancelable: false },
            );
        }
    };

    const handleDownload = async () => {
        if (Platform.OS === 'android') {
            const granted = await getPermissionAndroid();
            if (!granted) {
                return;
            }
        }

        RNFetchBlob.config({
            fileCache: true,
            appendExt: 'png',
        })
            .fetch('GET', galleryList[currentIndex].url)
            .then((res) => {
                CameraRoll.saveToCameraRoll(res.data, 'photo')
                    .then((res) => console.log('photo download', res))
                    .catch((err) => console.log('photo download error', err));
            })
            .catch((error) => console.log(error));
    };

    const _renderMessage = (item, type) => {
        return (
            <>
                {item.isDeleted ? (
                    <Text style={styles.deleteMessage}>message is deleted</Text>
                ) : item.message && item.isUpdated ? (
                    <Text style={styles.updatedMessage}>{item.message}</Text>
                ) : item.message && item.message.length > 0 ? (
                    <Text style={styles.message}>{item.message}</Text>
                ) : null}
                {!item.isDeleted && item?.imageData
                    ? item.imageData.map((v) => {
                          return (
                              <TouchableOpacity
                                  onPress={() => {
                                      setModalVisible(true);
                                      setImagePath(v.avatar_url);
                                      setCurrentIndex(galleryList.findIndex((g) => g.url === imagePath));
                                  }}
                                  onLongPress={() => singleTap(item, type)}>
                                  <FastImage source={{ uri: v.avatar_url }} style={styles.thumbnail} />
                              </TouchableOpacity>
                          );
                      })
                    : null}
                {!item.isDeleted && item.audio_url ? (
                    <TouchableOpacity onPress={() => handleToggleAudio(item.id)} onLongPress={() => singleTap(item, type)}>
                        <View style={styles.audioView}>
                            {selectedAudio[item.id] ? <PauseSvg /> : <PlayerSvg />}
                            <View style={styles.audio}>
                                <WaveForm
                                    autoPlay={false}
                                    source={{ uri: item.audio_url }}
                                    waveFormStyle={{ waveColor: colors.WHITE, scrubColor: colors.PRIMARY_COLOR }}
                                    play={!!selectedAudio[item.id]}
                                    style={styles.wave}
                                    onFinishPlay={() => handleStopAudio(item.id)}
                                />
                            </View>
                        </View>
                    </TouchableOpacity>
                ) : null}
            </>
        );
    };

    const _renderDate = (seconds) => {
        const convertDate = moment(new Date(seconds * 1000)).fromNow();
        return <Text style={styles.date}>{convertDate}</Text>;
    };

    const singleTap = (item, type) => {
        !item.isDeleted && showMessageActionsDialog(item, type);
    };

    const doubleTap = (item) => {
        handleLikeMessage(item, 'message-list');
    };

    const showVotedPeople = (users, type) => {
        setSelectedType(type);
        setVotedMembers(users);
        setTimeout(() => {
            votedMembersDialogRef.current.open && votedMembersDialogRef.current.open();
        }, 500);
    };

    const showLikedMembers = (members) => {
        setLikedMembers(members);
        setTimeout(() => {
            likedMembersDialogRef.current.open && likedMembersDialogRef.current.open();
        }, 500);
    };

    const votePress = (item, option) => {
        if (item.poll.votedUsers?.findIndex((v) => v === user.uid) > -1) {
            if (option.users?.findIndex((v) => v === user.uid) > -1) {
                return showVotedPeople(option.users, 'item');
            }
            if (option.users?.length > 0) {
                return showVotedPeople(option.users, 'item');
            }
            return;
        }

        handleVote(item.id, option);
    };

    const _renderSenderView = (item) => {
        return (
            <View style={styles.senderContainer}>
                {(item.replyMessage && item.replyMessage !== 'null') || item.message || item.imageData || item.audio_url ? (
                    <TouchableOpacity onLongPress={() => singleTap(item, 'sender')}>
                        <View style={styles.senderView}>
                            {item.replyMessage && item.replyMessage !== 'null' ? _renderReplyView(item) : null}
                            {_renderMessage(item, 'sender')}
                        </View>
                    </TouchableOpacity>
                ) : null}
                {item.poll ? _renderPoll(item) : null}
                <View style={styles.dateView}>{_renderDate(item.created_at?._seconds || item.created_at?.seconds)}</View>
            </View>
        );
    };

    const _renderReceiverView = (item) => {
        return (
            <>
                <View style={styles.receiverContainer}>
                    <TouchableOpacity onPress={() => navigation.push(USER_PROFILE, { userID: item.user.id })}>
                        <FastImage source={{ uri: item.user.avatar_url }} style={styles.avatar} />
                    </TouchableOpacity>
                    <DoubleTap singleTap={() => singleTap(item, 'receiver')} doubleTap={() => doubleTap(item)}>
                        <View style={styles.receiverView}>
                            <View style={styles.receiverInfo}>
                                <Text style={styles.receiverName}>{item.user.username || item.user.name}</Text>
                                {item.replyMessage && item.replyMessage !== 'null' ? _renderReplyView(item) : null}
                                {_renderMessage(item, 'receiver')}
                            </View>
                            {item.poll ? _renderPoll(item) : null}
                            {_renderDate(item.created_at?._seconds || item.created_at?.seconds)}
                        </View>
                    </DoubleTap>
                    {item.like && item.like.findIndex((v) => v === user.uid) > -1 ? (
                        <TouchableOpacity onPress={() => showLikedMembers(item.like)}>
                            <View style={styles.star}>
                                <StarSvg />
                                {item.like.length > 1 ? <Text style={styles.report}>+{item.like.length - 1}</Text> : null}
                            </View>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </>
        );
    };

    const _renderReplyView = (item) => {
        return (
            <View style={styles.replyMessageView}>
                <Text style={styles.receiverName}>{item.replyMessage?.user?.name}</Text>
                {item.replyMessage?.imageData &&
                    item.replyMessage.imageData.map((v) => {
                        return (
                            <TouchableOpacity
                                onPress={() => {
                                    setModalVisible(true);
                                    setImagePath(v.avatar_url);
                                }}>
                                <FastImage source={{ uri: v.avatar_url }} style={styles.thumbnail} />
                            </TouchableOpacity>
                        );
                    })}
                <Text style={styles.replyMessage}>{item.replyMessage?.message}</Text>
            </View>
        );
    };

    const _renderPoll = (item) => {
        if (item.isPollDeleted)
            return (
                <View style={[styles.pollView, { width: 150 }]}>
                    <Text style={styles.deleteMessage}>poll is deleted</Text>
                </View>
            );

        return (
            <TouchableOpacity onLongPress={() => showPollDialog(item)}>
                <View style={styles.pollView}>
                    <Text style={styles.question} numberOfLines={1} ellipsizeMode="tail">
                        {item.poll.question}
                    </Text>
                    {item.poll.options.map((option) => (
                        <TouchableOpacity onPress={() => votePress(item, option)}>
                            <View style={[styles.answerContainer, option.vote > 0 && { justifyContent: 'space-between' }]}>
                                <View
                                    style={[
                                        styles.answerView,
                                        option.vote > 0 && {
                                            backgroundColor: colors.PRIMARY_COLOR_2,
                                            width: `${Math.floor((option.vote / item.receiver.length) * 100)}%`,
                                        },
                                    ]}>
                                    <Text style={styles.answer} numberOfLines={1} ellipsizeMode="tail">
                                        {option.answer}
                                    </Text>
                                </View>
                                {option.vote > 0 ? (
                                    <Text style={styles.percentage}>
                                        {Math.floor((option.vote / item.receiver.length) * 100)}%
                                    </Text>
                                ) : null}
                            </View>
                        </TouchableOpacity>
                    ))}
                    <View style={styles.reportView}>
                        {!item.isPollHided ? (
                            item.poll.votedUsers?.findIndex((v) => v === user.uid) > -1 ? (
                                <TouchableOpacity onPress={() => handleRetractVote(item.id)}>
                                    <Text style={styles.report}>retract vote</Text>
                                </TouchableOpacity>
                            ) : (
                                <Text style={styles.report}>please vote</Text>
                            )
                        ) : (
                            <Text style={styles.report}></Text>
                        )}
                        <TouchableOpacity
                            onPress={() =>
                                !item.poll.anonymous && item.poll.vote > 0 && showVotedPeople(item.poll.votedUsers, 'all')
                            }>
                            <Text style={[styles.reportNum, !item.poll.anonymous ? { color: colors.PRIMARY_COLOR } : null]}>
                                {item.poll.vote} / {item.receiver?.length} voted
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    };

    const _renderThumbnail = (item) => {
        return (
            <TouchableOpacity
                onPress={() => {
                    setImagePath(item.url);
                    setCurrentIndex(galleryList.findIndex((v) => v.url === item.url));
                }}>
                <FastImage style={styles.footerThumbnail} source={{ uri: item?.url }} />
            </TouchableOpacity>
        );
    };

    return (
        <>
            <FlatList
                keyboardShouldPersistTaps="handled"
                ref={chatListRef}
                data={messages}
                renderItem={_renderItem}
                keyExtractor={(item) => item.id}
                onScrollEndDrag={_onScrollEndDrag}
                onScrollBeginDrag={_onScrollBeginDrag}
                viewabilityConfig={{
                    itemVisiblePercentThreshold: 75,
                    waitForInteraction: false,
                }}
                onContentSizeChange={() => {
                    setTimeout(() => {
                        isFirstLoading && scrollToEnd();
                    }, 200);
                }}
                onScrollToIndexFailed={(info) => {
                    chatListRef.current.scrollToIndex({
                        animated: true,
                        index: info.highestMeasuredFrameIndex,
                    });
                    setTimeout(() => {
                        scrollToEnd();
                    }, 200);
                }}
                // onViewableItemsChanged={_onViewableItemsChanged}
                refreshControl={<RefreshControl refreshing={refresh} onRefresh={onloadMoreMessages} title="load more" />}
                style={styles.container}
            />
            <Modal
                visible={visible && galleryList.length > 0}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}>
                <SafeAreaView style={styles.modalContainer}>
                    <View style={styles.modalHeader}>
                        <FontAwesome
                            style={styles.modalIcon}
                            size={30}
                            name={'angle-left'}
                            onPress={() => setModalVisible(false)}
                        />
                        <FontAwesome style={styles.modalIcon} size={30} name={'download'} onPress={handleDownload} />
                    </View>
                </SafeAreaView>
                <ImageViewer
                    imageUrls={galleryList}
                    useNativeDriver={true}
                    enableSwipeDown={true}
                    onSwipeDown={() => {
                        setModalVisible(false);
                    }}
                    index={galleryList.findIndex((v) => v.url === imagePath)}
                />
                <View style={styles.gallery}>
                    <FlatList
                        data={galleryList}
                        renderItem={({ item }) => _renderThumbnail(item)}
                        keyExtractor={(item, index) => index}
                        pagingEnabled={true}
                        showsHorizontalScrollIndicator={false}
                        horizontal
                    />
                </View>
            </Modal>
            <VotedMembersDialog
                votedMembersDialogRef={votedMembersDialogRef}
                members={currentGroup.members}
                votedMembers={votedMembers}
                selectedType={selectedType}
            />
            <LikedMembersDialog
                likedMembersDialogRef={likedMembersDialogRef}
                members={currentGroup.members}
                likedMembers={likedMembers}
            />
        </>
    );
};

export default MessageList;

const styles = StyleSheet.create({
    modalContainer: {
        backgroundColor: colors.BLACK,
    },
    modalHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    modalIcon: {
        color: colors.WHITE,
    },
    container: {
        paddingVertical: 20,
        width: width,
    },
    senderContainer: {
        alignItems: 'flex-end',
        paddingRight: 20,
        marginBottom: 30,
    },
    senderView: {
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomLeftRadius: 15,
        maxWidth: width * 0.6,
        backgroundColor: 'rgba(106, 195, 193, 0.3)',
        paddingVertical: 10,
        paddingHorizontal: 10,
    },
    receiverContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingLeft: 20,
        marginBottom: 30,
        maxWidth: width * 0.8,
    },
    receiverView: {
        marginLeft: 10,
        maxWidth: width * 0.6,
    },
    receiverInfo: {
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: colors.WHITE_2,
        borderTopLeftRadius: 15,
        borderTopRightRadius: 15,
        borderBottomRightRadius: 15,
    },
    message: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        lineHeight: 20,
        fontWeight: 'normal',
        color: 'rgba(rgba(0, 0, 0, 0.8)',
    },
    deleteMessage: {
        fontFamily: fonts.MULISH_MEDIUM_ITALIC,
        fontSize: 13,
        lineHeight: 20,
        fontWeight: 'normal',
        color: 'rgba(rgba(0, 0, 0, 0.5)',
    },
    updatedMessage: {
        fontFamily: fonts.MULISH_MEDIUM_ITALIC,
        fontStyle: 'italic',
        fontSize: 15,
        lineHeight: 20,
        fontWeight: 'normal',
        color: 'rgba(rgba(0, 0, 0, 0.8)',
    },
    receiverName: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        fontWeight: '600',
        color: colors.PRIMARY_COLOR,
        marginBottom: 10,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginBottom: 20,
        marginTop: 10,
    },
    date: {
        marginTop: 5,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: 'rgba(0, 0, 0, 0.5)',
    },
    thumbnail: {
        width: width * 0.4,
        height: width * 0.4,
        borderRadius: 15,
        marginTop: 10,
    },
    replyMessageView: {
        borderLeftWidth: 2,
        borderLeftColor: colors.PRIMARY_COLOR,
        paddingLeft: 5,
        marginBottom: 10,
    },
    replyIcon: {
        marginLeft: 10,
    },
    replyMessage: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: 'rgba(0, 0, 0, 0.8)',
        marginTop: 5,
    },
    pollView: {
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        borderBottomLeftRadius: 25,
        width: width * 0.7,
        backgroundColor: colors.WHITE_2,
        paddingVertical: 20,
        paddingHorizontal: 20,
        marginTop: 30,
    },
    question: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: '600',
        fontSize: 15,
        lineHeight: 20,
        color: colors.BLACK_2,
        marginBottom: 20,
    },
    answer: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: '600',
        fontSize: 13,
        lineHeight: 20,
        color: colors.BLACK,
    },
    answerContainer: {
        backgroundColor: colors.WHITE,
        borderRadius: 15,
        height: 40,
        marginBottom: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    answerView: {
        height: 40,
        justifyContent: 'center',
        paddingHorizontal: 20,
        borderTopLeftRadius: 15,
        borderBottomLeftRadius: 15,
        borderTopRightRadius: 25,
        borderBottomRightRadius: 25,
    },
    percentage: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: '600',
        fontSize: 13,
        color: colors.PRIMARY_COLOR,
        position: 'absolute',
        right: 20,
    },
    reportView: {
        marginVertical: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    report: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: '600',
        fontSize: 13,
        color: colors.GREY_6,
    },
    reportNum: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.GREY_6,
    },
    dateView: {
        alignItems: 'flex-end',
    },
    star: {
        flexDirection: 'row',
    },
    footerThumbnail: {
        width: 70,
        height: 70,
        borderRadius: 10,
        marginRight: 5,
    },
    gallery: {
        paddingHorizontal: 20,
        height: 100,
        backgroundColor: colors.BLACK,
    },
    audioView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    audio: {
        width: width * 0.6 - 70,
    },
    wave: {
        width: width * 0.6 - 70,
        height: 50,
    },
});
