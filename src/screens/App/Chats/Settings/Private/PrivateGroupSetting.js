import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import GlobalStyles from '../../../../../constants/globalStyles';
import { colors, fonts } from '../../../../../constants';
import { CHATS, CHATTING_MEMBERS, ADD_ROOM_MEMBERS } from '../../../../../navigator/constants';
import FirebaseChat from '../../../../../service/firebase_requests/Chat';
import FirebasePublicForumChat from '../../../../../service/firebase_requests/PublicForumChat';
import FirebaseUser from '../../../../../service/firebase_requests/User';
import FirebaseErrors from '../../../../../service/firebase_errors';
import EThreeService from '../../../../../service/virgil_security';

import LeaveChatSvg from '../../../../../assets/Images/Chat/leave-chat.svg';
import SettingUserSvg from '../../../../../assets/Images/setting-add-user.svg';
import SettingMuteSvg from '../../../../../assets/Images/setting-mute.svg';
import SettingUnMuteSvg from '../../../../../assets/Images/un-mute.svg';
import SettingRemoveSvg from '../../../../../assets/Images/Chat/trash-bin.svg';
import SettingSearchSvg from '../../../../../assets/Images/setting-search.svg';
import SettingMoreSvg from '../../../../../assets/Images/setting-more.svg';
import SettingPencilSvg from '../../../../../assets/Images/pencil.svg';

import HeaderIcon from '../../../../../components/App/HeaderIcon';
import LoadingDotsOverlay from '../../../../../components/LoadingDotsOverlay';
import Toast from '../../../../../components/Toast';
import ChoosePhotoDialog from '../../../../../components/Dialogs/ChoosePhotoDialog';
import LeaveDialog from '../../../../../components/Chat/LeaveDialog';
import DeletePrivateGroupDialog from '../../../../../components/Chat/DeletePrivateGroupDialog';
import ChatRoomAvatarUpload from '../../../../../components/Chat/Media/ChatRoomAvatarUpload';
import MediaSection from '../../../../../components/Chat/Setting/MediaSection';

const PrivateGroupSetting = ({ navigation, route }) => {
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [room, setRoom] = useState(route.params?.room || null);
    const [members, setMembers] = useState(null);
    const [name, setName] = useState(room?.name || '');
    const [editingName, setEditingName] = useState(false);
    const [avatar, setAvatar] = useState(room?.avatar_url || null);
    const choosePhotoDialogRef = useRef();
    const leaveDialogRef = useRef();
    const deleteDialogRef = useRef();
    const nameInputRef = useRef();
    const aboutInputRef = useRef();
    const isOwner = room ? room?.owner === user?.uid : false;
    const isMuted = room ? room?.muted?.indexOf(user?.uid) !== -1 : false;

    useLayoutEffect(() => {
        navigation &&
            !isOwner &&
            navigation.setOptions({
                headerRight: () => (
                    <HeaderIcon onPress={toggleLeaveDialog} style={{ width: 60, justifyContent: 'center' }}>
                        <LeaveChatSvg width={30} height={20} />
                    </HeaderIcon>
                ),
            });
    }, [navigation, isOwner]);

    useEffect(() => {
        const onRoom = (roomSnapshot) => {
            if (roomSnapshot.exists) {
                setRoom({ id: roomSnapshot.id, ...roomSnapshot.data() });
                roomSnapshot.data().avatar_url && setAvatar(roomSnapshot.data().avatar_url);
            }
        };
        const unsubscribe = FirebaseChat.getChatRoom(room.id, onRoom, (error) => FirebaseErrors.setError(error, setError));

        return unsubscribe;
    }, [room?.id]);

    useEffect(() => {
        if (Array.isArray(room?.members)) {
            Promise.all(room.members.map((uid) => FirebaseUser.getUserById(uid)))
                .then((data) => {
                    setMembers(data);
                    if (!name && !isOwner) {
                        let name = '';
                        data.forEach((u, index) => {
                            if (index === data.length - 1) {
                                name = name.concat(u.name);
                            } else {
                                name = name.concat(`${u.name}, `);
                            }
                        });
                        setName(name);
                    }
                })
                .finally(() => setLoading(false));
        }
    }, [room?.members]);

    const toggleChoosePhotoDialog = () => {
        choosePhotoDialogRef.current && choosePhotoDialogRef.current.open();
    };

    const toggleLeaveDialog = () => {
        leaveDialogRef.current && leaveDialogRef.current.state.modalVisible
            ? leaveDialogRef.current.close()
            : leaveDialogRef.current.open();
    };

    const toggleDeleteGroupDialog = () => {
        deleteDialogRef.current && deleteDialogRef.current.state.modalVisible
            ? deleteDialogRef.current.close()
            : deleteDialogRef.current.open();
    };

    const toggleMuteForum = () => {
        return FirebaseChat.muteChatRoom(room.id, !isMuted).catch((error) => FirebaseErrors.setError(error, setError));
    };

    const toggleNameEdit = () => {
        !editingName && setTimeout(() => nameInputRef.current.focus(), 100);
        setEditingName(!editingName);
    };

    const updateName = () => {
        Keyboard.dismiss();
        setEditingName(!editingName);
        if (name.trim() === room?.name) return;
        setLoading(true);
        return FirebaseChat.updatePrivateGroupName(room.id, name.trim())
            .catch((error) => FirebaseErrors.setError(error, setError))
            .finally(() => setLoading(false));
    };

    const updateAvatar = (image) => {
        setTimeout(() => {
            setLoading(true);
            FirebasePublicForumChat.updateForumAvatar(room.id, image)
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        }, 500);
    };

    const leaveGroup = () => {
        toggleLeaveDialog();

        return FirebasePublicForumChat.leaveChat(room.id)
            .then(() => navigation && navigation.navigate(CHATS))
            .catch((error) => FirebaseErrors.setError(error, setError));
    };

    const deleteGroup = () => {
        toggleDeleteGroupDialog();

        return Promise.all([FirebaseChat.deleteChatRoom(room.id), EThreeService.deleteGroup(room.id)])
            .then(() => navigation && navigation.navigate(CHATS))
            .catch((error) => FirebaseErrors.setError(error, setError));
    };

    const navigateToChatRoomMembers = () => {
        return navigation && room.id && navigation.push(CHATTING_MEMBERS, { roomID: room.id });
    };

    const navigateToAddRoomMembers = () => {
        return navigation && room.id && navigation.push(ADD_ROOM_MEMBERS, { roomID: room.id });
    };

    const options = isOwner
        ? [
              {
                  key: 'add',
                  title: 'add',
                  icon: (
                      <TouchableOpacity onPress={navigateToAddRoomMembers}>
                          <SettingUserSvg />
                      </TouchableOpacity>
                  ),
              },
              {
                  key: 'mute',
                  title: isMuted ? 'unmute' : 'mute',
                  icon: (
                      <TouchableOpacity onPress={toggleMuteForum}>
                          {isMuted ? <SettingMuteSvg /> : <SettingUnMuteSvg />}
                      </TouchableOpacity>
                  ),
              },
              {
                  key: 'delete',
                  title: 'delete',
                  icon: (
                      <TouchableOpacity style={styles.trashbinContainer} onPress={toggleDeleteGroupDialog}>
                          <SettingRemoveSvg />
                      </TouchableOpacity>
                  ),
              },
          ]
        : [
              {
                  key: 'mute',
                  title: isMuted ? 'unmute' : 'mute',
                  icon: (
                      <TouchableOpacity onPress={toggleMuteForum}>
                          {isMuted ? <SettingMuteSvg /> : <SettingUnMuteSvg />}
                      </TouchableOpacity>
                  ),
              },
          ];

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <ScrollView>
                <View style={styles.container}>
                    <ChatRoomAvatarUpload avatar={avatar} disabled={!isOwner} toggleChoosePhotoDialog={toggleChoosePhotoDialog} />
                    <View style={styles.roomNameContainer}>
                        {isOwner ? (
                            <TextInput
                                ref={nameInputRef}
                                value={name}
                                placeholder={'group name'}
                                editable={editingName}
                                onChangeText={setName}
                                style={styles.roomName}
                                onBlur={updateName}
                                blurOnSubmit
                                returnKeyType="done"
                                multiline
                            />
                        ) : (
                            <Text style={styles.roomName}>{name}</Text>
                        )}
                        {!editingName && isOwner && (
                            <TouchableOpacity style={styles.roomAboutEdit} onPress={toggleNameEdit}>
                                <SettingPencilSvg />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.membersLength}>{`${members?.length} ${
                        members?.length === 1 ? 'member' : 'members'
                    }`}</Text>
                    <View style={styles.optionsContainer}>
                        {options.map((o) => (
                            <View key={o.key} style={{ alignItems: 'center' }}>
                                {o.icon}
                                <Text style={styles.option}>{o.title}</Text>
                            </View>
                        ))}
                    </View>
                </View>
                <View>
                    <View style={styles.membersHeaderContainer}>
                        <Text style={styles.members}>members {`(${members?.length})`}</Text>
                        <TouchableOpacity onPress={navigateToChatRoomMembers}>
                            <Text style={styles.seeAll}>see all</Text>
                        </TouchableOpacity>
                    </View>
                    <FlatList
                        keyExtractor={(item) => item.uid}
                        data={members}
                        renderItem={({ item }) => (
                            <View style={styles.membersItem}>
                                <FastImage
                                    source={{ uri: item?.avatar_url }}
                                    resizeMode={FastImage.resizeMode.contain}
                                    style={styles.membersAvatar}
                                />
                                <Text numberOfLines={2} ellipsizeMode="tail" style={styles.membersName}>
                                    {item?.name}
                                </Text>
                            </View>
                        )}
                        horizontal
                        contentContainerStyle={{ marginLeft: 20 }}
                    />
                </View>
                <MediaSection navigation={navigation} room={room} />
            </ScrollView>
            <ChoosePhotoDialog
                forwardRef={choosePhotoDialogRef}
                photo={avatar}
                onPhotoClick={updateAvatar}
                setError={setError}
                imagePickerOptions={{ width: 300, height: 300, cropperCircleOverlay: true }}
            />
            <LeaveDialog forwardRef={leaveDialogRef} onClose={toggleLeaveDialog} onLeave={leaveGroup} />
            <DeletePrivateGroupDialog forwardRef={deleteDialogRef} onClose={toggleDeleteGroupDialog} onDelete={deleteGroup} />
        </SafeAreaView>
    );
};

export default PrivateGroupSetting;

const styles = StyleSheet.create({
    container: {
        margin: 20,
        alignItems: 'center',
    },
    roomNameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 5,
    },
    roomName: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
        paddingHorizontal: 20,
        textAlign: 'center',
    },
    membersLength: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.GREY_2,
    },
    optionsContainer: {
        flexDirection: 'row',
        width: '100%',
        paddingHorizontal: 20,
        justifyContent: 'space-evenly',
        marginTop: 30,
    },
    option: {
        paddingTop: 10,
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
    },
    trashbinContainer: {
        height: 50,
        width: 50,
        backgroundColor: colors.RED_2,
        borderRadius: 50 / 2,
        justifyContent: 'center',
        alignItems: 'center',
    },
    membersHeaderContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    members: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
    },
    seeAll: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
        color: colors.PRIMARY_COLOR,
    },
    membersItem: {
        maxWidth: 50,
        alignItems: 'center',
        marginRight: 20,
    },
    membersAvatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    membersName: {
        paddingTop: 10,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
    },
});
