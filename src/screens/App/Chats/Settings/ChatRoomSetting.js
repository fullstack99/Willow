import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, ScrollView, FlatList, TouchableOpacity, TextInput, Keyboard } from 'react-native';
import { useSelector } from 'react-redux';
import FastImage from 'react-native-fast-image';
import GlobalStyles from '../../../../constants/globalStyles';
import { colors, fonts } from '../../../../constants';
import { CHATS, CHATTING_MEMBERS } from '../../../../navigator/constants';
import FirebasePublicForumChat from '../../../../service/firebase_requests/PublicForumChat';
import FirebaseChat from '../../../../service/firebase_requests/Chat';
import FirebaseUser from '../../../../service/firebase_requests/User';
import FirebaseErrors from '../../../../service/firebase_errors/';

import LeaveChatSvg from '../../../../assets/Images/Chat/leave-chat.svg';
import SettingUserSvg from '../../../../assets/Images/setting-add-user.svg';
import SettingMuteSvg from '../../../../assets/Images/setting-mute.svg';
import SettingUnMuteSvg from '../../../../assets/Images/un-mute.svg';
import SettingSearchSvg from '../../../../assets/Images/setting-search.svg';
import SettingMoreSvg from '../../../../assets/Images/setting-more.svg';
import SettingPencilSvg from '../../../../assets/Images/pencil.svg';

import HeaderIcon from '../../../../components/App/HeaderIcon';
import LoadingDotsOverlay from '../../../../components/LoadingDotsOverlay';
import Toast from '../../../../components/Toast';
import ChoosePhotoDialog from '../../../../components/Dialogs/ChoosePhotoDialog';
import LeaveDialog from '../../../../components/Chat/LeaveDialog';
import ChatRoomAvatarUpload from '../../../../components/Chat/Media/ChatRoomAvatarUpload';
import MediaSection from '../../../../components/Chat/Setting/MediaSection';

const FORUM_ABOUT_MAX = 250;

const ChatRoomSetting = ({ navigation, route }) => {
    const user = useSelector((state) => state.auth.user);
    const [error, setError] = useState(!room ? 'server error' : '');
    const [loading, setLoading] = useState(false);
    const [room, setRoom] = useState(route.params?.room || null);
    const [members, setMembers] = useState(null);
    const [avatar, setAvatar] = useState(room?.avatar_url || null);
    const [name, setName] = useState(room?.name || '');
    const [editingName, setEditingName] = useState(false);
    const [about, setAbout] = useState(room?.about || '');
    const [editingAbout, setEditingAbout] = useState(false);
    const choosePhotoDialogRef = useRef();
    const leaveDialogRef = useRef();
    const nameInputRef = useRef();
    const aboutInputRef = useRef();
    const isAdmin = room?.admin.indexOf(user?.uid) !== -1 || false;
    const isMember = room?.members.indexOf(user?.uid) !== -1 || false;
    const isMuted = room?.muted.indexOf(user?.uid) !== -1 || false;

    useLayoutEffect(() => {
        navigation &&
            !isAdmin &&
            isMember &&
            navigation.setOptions({
                headerRight: () => (
                    <HeaderIcon onPress={toggleLeaveDialog} style={{ width: 60, justifyContent: 'center' }}>
                        <LeaveChatSvg width={30} height={20} />
                    </HeaderIcon>
                ),
            });
    }, [navigation, isAdmin, isMember]);

    useEffect(() => {
        const onRoom = (roomSnapshot) => {
            setRoom({ id: roomSnapshot.id, ...roomSnapshot.data() });
            roomSnapshot.data().avatar_url && setAvatar(roomSnapshot.data().avatar_url);
        };
        const unsubscribe = FirebaseChat.getChatRoom(room.id, onRoom, (error) => FirebaseErrors.setError(error, setError));

        return unsubscribe;
    }, [room?.id]);

    useEffect(() => {
        if (Array.isArray(room?.members) && room.members.length > 0) {
            Promise.all(room.members.map((id) => FirebaseUser.getUserById(id))).then((users) => {
                setMembers(users);
            });
        } else {
            setMembers([]);
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

    const navigateToChatRoomMembers = () => {
        return navigation && room.id && navigation.push(CHATTING_MEMBERS, { roomID: room.id });
    };

    const updateAvatar = (image) => {
        setTimeout(() => {
            setLoading(true);
            FirebasePublicForumChat.updateForumAvatar(room.id, image)
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        }, 500);
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
        return FirebasePublicForumChat.updateForumName(room.id, name?.trim())
            .catch((error) => FirebaseErrors.setError(error, setError))
            .finally(() => setLoading(false));
    };

    const toggleAboutEdit = () => {
        !editingAbout && setTimeout(() => aboutInputRef.current.focus(), 100);
        setEditingAbout(!editingAbout);
    };

    const updateAbout = () => {
        Keyboard.dismiss();
        setEditingAbout(!editingAbout);
        if (about?.trim() === room?.about) return;
        setLoading(true);
        return FirebasePublicForumChat.updateForumAbout(room.id, about?.trim())
            .catch((error) => FirebaseErrors.setError(error, setError))
            .finally(() => setLoading(false));
    };

    const toggleMuteForum = () => {
        FirebaseChat.muteChatRoom(room.id, !isMuted).catch((error) => FirebaseErrors.setError(error, setError));
    };

    const leaveForum = () => {
        toggleLeaveDialog();

        return FirebasePublicForumChat.leaveChat(room.id)
            .then(() => navigation && navigation.navigate(CHATS))
            .catch((error) => FirebaseErrors.setError(error, setError));
    };

    const options = isAdmin
        ? [
              //   {
              //       key: 'add',
              //       title: 'add',
              //       icon: (
              //           <TouchableOpacity>
              //               <SettingUserSvg />
              //           </TouchableOpacity>
              //       ),
              //   },
              {
                  key: 'mute',
                  title: isMuted ? 'unmute' : 'mute',
                  icon: (
                      <TouchableOpacity onPress={toggleMuteForum}>
                          {isMuted ? <SettingMuteSvg /> : <SettingUnMuteSvg />}
                      </TouchableOpacity>
                  ),
              },
              //   {
              //       key: 'more',
              //       title: 'more',
              //       icon: (
              //           <TouchableOpacity>
              //               <SettingMoreSvg />
              //           </TouchableOpacity>
              //       ),
              //   },
          ]
        : [
              //   {
              //       key: 'add',
              //       title: 'add',
              //       icon: (
              //           <TouchableOpacity>
              //               <SettingUserSvg />
              //           </TouchableOpacity>
              //       ),
              //   },
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

    if (!room)
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
            </SafeAreaView>
        );

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <LoadingDotsOverlay animation={loading} />
            <ScrollView>
                <View style={styles.container}>
                    <ChatRoomAvatarUpload avatar={avatar} disabled={!isAdmin} toggleChoosePhotoDialog={toggleChoosePhotoDialog} />
                    {/* <Text style={styles.roomName}>{room?.name}</Text> */}
                    <View style={styles.roomNameContainer}>
                        <TextInput
                            ref={nameInputRef}
                            value={name}
                            editable={editingName}
                            onChangeText={setName}
                            style={styles.roomName}
                            onBlur={updateName}
                            blurOnSubmit
                            returnKeyType="done"
                            multiline
                        />
                        {!editingName && isAdmin && (
                            <TouchableOpacity style={styles.roomAboutEdit} onPress={toggleNameEdit}>
                                <SettingPencilSvg />
                            </TouchableOpacity>
                        )}
                    </View>
                    <Text style={styles.membersLength}>{`${members?.length} ${
                        members?.length === 1 ? 'member' : 'members'
                    }`}</Text>
                    <View style={styles.roomAboutContainer}>
                        <TextInput
                            ref={aboutInputRef}
                            value={about}
                            editable={editingAbout}
                            onChangeText={setAbout}
                            style={styles.roomAbout}
                            onBlur={updateAbout}
                            returnKeyType="default"
                            multiline
                            maxLength={FORUM_ABOUT_MAX}
                        />
                        {!editingAbout && isAdmin && (
                            <TouchableOpacity style={styles.roomAboutEdit} onPress={toggleAboutEdit}>
                                <SettingPencilSvg />
                            </TouchableOpacity>
                        )}
                    </View>
                    {isMember && (
                        <View style={styles.optionsContainer}>
                            {options.map((o) => (
                                <View key={o.key} style={{ alignItems: 'center' }}>
                                    {o.icon}
                                    <Text style={styles.option}>{o.title}</Text>
                                </View>
                            ))}
                        </View>
                    )}
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
            <LeaveDialog forwardRef={leaveDialogRef} onClose={toggleLeaveDialog} onLeave={leaveForum} />
        </SafeAreaView>
    );
};

export default ChatRoomSetting;

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
    roomAboutContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    roomAbout: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        paddingHorizontal: 20,
        textAlign: 'center',
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
    membersContainer: {},
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
