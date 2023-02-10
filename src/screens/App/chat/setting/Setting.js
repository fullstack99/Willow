/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    SafeAreaView,
    StyleSheet,
    TouchableOpacity,
    FlatList,
    ScrollView,
    PermissionsAndroid,
    Platform,
    TextInput,
} from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import Contacts from 'react-native-contacts';

import { colors, fonts } from '../../../../constants';
import Header from '../../../../components/Chat/Header';
import User from '../../../../components/Chat/User';
import LeaveDialog from '../../../../components/Chat/LeaveDialog';
import ShareDialog from '../../../../components/Chat/ShareDialog';
import AllowContacts from '../../../../components/Chat/AllowContacts';
import FileUpload from '../../../../components/Chat/FileUpload';
import LoadingDotsOverlay from '../../../../components/LoadingDotsOverlay';
import { CHATTING_MEMBERS, ADD_FRIEND, APP_CONTENT, SHARED_MEDIA, CONTACT_LIST, CHATS } from '../../../../navigator/constants';
import { updateChatRoom, deleteChatRoom, updatePublicGroup } from '../../../../actions/chatAction';
import Chat from '../../../../service/firebase_requests/Chat';

import LogoutSvg from '../../../../assets/Images/logout.svg';
import SettingUserSvg from '../../../../assets/Images/setting-add-user.svg';
import SettingMuteSvg from '../../../../assets/Images/setting-mute.svg';
import SettingUnMuteSvg from '../../../../assets/Images/un-mute.svg';
import SettingSearchSvg from '../../../../assets/Images/setting-search.svg';
import SettingMoreSvg from '../../../../assets/Images/setting-more.svg';
import ShareMediaSvg from '../../../../assets/Images/share-media.svg';
import BookSvg from '../../../../assets/Images/book.svg';
import ArrowRightSvg from '../../../../assets/Images/arrow-right.svg';
import EditSvg from '../../../../assets/Images/pen-green.svg';
import SaveSvg from '../../../../assets/Images/check-small.svg';
import { Keyboard } from 'react-native';
import { SET_LOADING } from '../../../../actions/feedActions';

const NewChat = ({ navigation, chatId, route }) => {
    const { from } = route.params;
    const [refresh, setRefresh] = useState(false);
    const [permission, setPermisstion] = useState('member'); // TODO admin
    const [contacts, setContacts] = useState([]);
    const [showContact, setShowContact] = useState(false);
    const [roomName, setRoomName] = useState('');
    const [about, setAbout] = useState('');
    const [roomNameEditable, setRoomNameEditable] = useState(false);
    const [aboutEditable, setAboutEditable] = useState(false);
    const [loading, setLoading] = useState(false);
    const leaveRef = useRef(null);
    const shareRef = useRef(null);
    const { user } = useSelector((state) => state.auth);
    const { currentGroup, isLoaded, isLoading, isDeleted } = useSelector((state) => state.chats);
    const dispatch = useDispatch();

    useEffect(() => {
        if (!currentGroup) {
            setLoading(false);
            navigation.navigate(CHATS);
            return;
        }
        setRefresh(!refresh);
        setRoomName(currentGroup.roomName);
        setAbout(currentGroup.about);
        setLoading(false);
        if (user.uid === currentGroup.owner) setPermisstion('admin');
        if (Platform.OS === 'android') {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS, {
                title: 'Contacts',
                message: 'This app would like to view your contacts.',
            }).then(() => {
                loadContacts();
            });
        } else {
            loadContacts();
        }
    }, [currentGroup]);

    useEffect(() => {
        if (isLoaded && isDeleted && !isLoading && loading) {
            setLoading(false);
            navigation.navigate(CHATS);
        }
    }, [isLoaded, isLoading, isDeleted]);

    const loadContacts = () => {
        Contacts.getAll().then((contacts) => {
            setContacts(contacts);
        });

        Contacts.checkPermission().then((permission) => {
            // Contacts.PERMISSION_AUTHORIZED || Contacts.PERMISSION_UNDEFINED || Contacts.PERMISSION_DENIED
            if (permission === 'undefined') {
                setShowContact(true);
            }
            if (permission === 'authorized') {
            }
            if (permission === 'denied') {
                setShowContact(true);
            }
        });
    };

    const leaveChat = () => leaveRef.current.open && leaveRef.current.open();

    const goBack = () => navigation.goBack();

    const addUser = () => navigation.navigate(ADD_FRIEND);

    const handletoggleMute = () => dispatch(updateChatRoom(currentGroup.id, { mute: !currentGroup.mute }));

    const handleSearch = () => console.log('handleSearch');

    const handleAdminApprove = () => {
        dispatch(updateChatRoom(currentGroup.id, { adminApprove: !currentGroup.adminApprove }));
    };

    const handleMore = () => shareRef.current.open && shareRef.current.open();

    const handleLeave = () => {
        leaveRef.current.close();
        console.log('leave chat');
        setTimeout(() => {
            setLoading(true);
            dispatch(updatePublicGroup(currentGroup.id, { userId: user.uid }));
        }, 500);
    };

    const handleDeleteRoom = () => {
        console.log('delete chat');
        shareRef.current.close();
        setTimeout(() => {
            setLoading(true);
            dispatch(deleteChatRoom(currentGroup.id));
        }, 500);
    };

    const setGroupImage = async (path) => {
        setLoading(true);
        const imageData = await Chat.uploadChatAvatar(path);
        const data = {
            avatar_url: imageData.avatar_url,
            fileName: imageData.filename,
        };
        dispatch(updateChatRoom(currentGroup.id, { ...data }));
    };

    const handleShare = () => {
        shareRef.current.close();

        setTimeout(() => {
            console.log('share');
            navigation.navigate(CONTACT_LIST, { title: 'share link', contacts: contacts, from: 'chat-setting' });
        }, 500);
    };

    const handleUpdateRoomName = () => {
        Keyboard.dismiss();
        if (roomNameEditable && currentGroup.roomName !== roomName && roomName) {
            setLoading(true);
            dispatch(updateChatRoom(currentGroup.id, { roomName }));
        }
        setRoomNameEditable(!roomNameEditable);
    };

    const handleUpdateAbout = () => {
        Keyboard.dismiss();
        if (aboutEditable && currentGroup.about !== about) {
            setLoading(true);
            dispatch(updateChatRoom(currentGroup.id, { about }));
        }
        setAboutEditable(!aboutEditable);
    };

    const renderLeaveDialogSheet = () => {
        return (
            <LeaveDialog
                leaveRef={leaveRef}
                onClose={() => leaveRef.current.close()}
                onDone={(phone) => {}}
                onLeave={handleLeave}
            />
        );
    };

    const renderShareDialogSheet = () => {
        return (
            <ShareDialog
                shareRef={shareRef}
                permission={permission}
                onShare={handleShare}
                onDelete={handleDeleteRoom}
                handleAdminApprove={handleAdminApprove}
            />
        );
    };

    if (!currentGroup) return null;

    return (
        <>
            <LoadingDotsOverlay animation={loading} />
            <SafeAreaView style={styles.container}>
                <Header enabledBack={true} title="" goBack={goBack} icon={<LogoutSvg />} onPress={leaveChat} />
                <ScrollView>
                    <FileUpload setGroupImage={setGroupImage} groupImg={currentGroup.avatar_url} from={from} />
                    <View style={styles.chatInfo}>
                        {currentGroup.roomType === 'new_public_forum' && (
                            <View style={styles.inputItem}>
                                <TextInput
                                    onSubmitEditing={handleUpdateRoomName}
                                    style={styles.title}
                                    onChangeText={(text) => setRoomName(text)}
                                    placeholder={'Type room name'}
                                    placeholderTextColor="#9d9d9d"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    value={roomName}
                                    editable={roomNameEditable}
                                />
                                {permission === 'admin' && (
                                    <TouchableOpacity onPress={handleUpdateRoomName}>
                                        {roomNameEditable ? <SaveSvg /> : <EditSvg />}
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}

                        <Text style={styles.length}>{currentGroup.members && currentGroup.members.length} members</Text>
                        {currentGroup.roomType === 'new_public_forum' && (
                            <View style={styles.inputItem}>
                                <TextInput
                                    onSubmitEditing={handleUpdateAbout}
                                    style={styles.description}
                                    onChangeText={(text) => setAbout(text)}
                                    placeholder={'Type about'}
                                    placeholderTextColor="#9d9d9d"
                                    autoCorrect={false}
                                    autoCapitalize="none"
                                    value={about}
                                    editable={aboutEditable}
                                />
                                {permission === 'admin' && (
                                    <TouchableOpacity onPress={handleUpdateAbout}>
                                        {aboutEditable ? <SaveSvg /> : <EditSvg />}
                                    </TouchableOpacity>
                                )}
                            </View>
                        )}
                    </View>
                    <View style={styles.actionView}>
                        <TouchableOpacity onPress={addUser} style={styles.actionItem}>
                            <SettingUserSvg />
                            <Text style={styles.actionName}>add</Text>
                        </TouchableOpacity>
                        {currentGroup.mute ? (
                            <TouchableOpacity onPress={handletoggleMute} style={styles.actionItem}>
                                <SettingMuteSvg />
                                <Text style={styles.actionName}>un-mute</Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={handletoggleMute} style={styles.actionItem}>
                                <SettingUnMuteSvg />
                                <Text style={styles.actionName}>mute</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity onPress={handleSearch} style={styles.actionItem}>
                            <SettingSearchSvg />
                            <Text style={styles.actionName}>search</Text>
                        </TouchableOpacity>
                        {from === 'new_public_forum' && (
                            <TouchableOpacity onPress={handleMore} style={styles.actionItem}>
                                <SettingMoreSvg />
                                <Text style={styles.actionName}>more</Text>
                            </TouchableOpacity>
                        )}
                    </View>
                    <View style={styles.memberContainer}>
                        <View style={styles.memberView}>
                            <Text style={styles.text}>
                                members{' '}
                                <Text style={styles.membersLength}>({currentGroup.members && currentGroup.members.length})</Text>
                            </Text>
                            <TouchableOpacity onPress={() => navigation.navigate(CHATTING_MEMBERS, { from: 'chat-setting' })}>
                                <Text style={styles.seeAll}>see all</Text>
                            </TouchableOpacity>
                        </View>
                        <FlatList
                            data={currentGroup.members}
                            renderItem={({ item }) => <User item={item} from="chat-setting" navigation={navigation} />}
                            keyExtractor={(item) => item.id}
                            pagingEnabled={true}
                            showsHorizontalScrollIndicator={false}
                            horizontal
                            extraData={refresh}
                        />
                    </View>
                    <View style={styles.mediaContainer}>
                        <Text style={styles.text}>media</Text>
                        <TouchableOpacity style={styles.mediaItem} onPress={() => navigation.navigate(SHARED_MEDIA)}>
                            <View style={styles.mediaType}>
                                <ShareMediaSvg />
                                <Text style={styles.mediaTitle}>shared media</Text>
                            </View>
                            <ArrowRightSvg />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.mediaItem} onPress={() => navigation.navigate(APP_CONTENT)}>
                            <View style={styles.mediaType}>
                                <BookSvg />
                                <Text style={styles.mediaTitle}>app's content</Text>
                            </View>
                            <ArrowRightSvg />
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                {renderLeaveDialogSheet()}
                {renderShareDialogSheet()}
                {showContact && <AllowContacts />}
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    chatInfo: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 30,
    },
    thumbnail: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
    },
    title: {
        fontFamily: fonts.NEWYORKEXTRALARGE_BLACK,
        fontWeight: '500',
        fontSize: 24,
        marginBottom: 5,
        marginRight: 10,
        maxWidth: '70%',
    },
    length: {
        fontFamily: fonts.MULISH_MEDIUM,
        fontSize: 15,
        color: colors.GREY_2,
        marginBottom: 30,
    },
    description: {
        fontFamily: fonts.MULISH_MEDIUM,
        fontSize: 15,
        color: colors.BLACK,
        textAlign: 'center',
        marginRight: 10,
        maxWidth: '70%',
    },
    actionView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        marginVertical: 40,
    },
    actionItem: {
        alignItems: 'center',
        marginHorizontal: 15,
    },
    actionName: {
        fontFamily: fonts.MULISH_MEDIUM,
        fontWeight: '600',
        fontSize: 13,
    },
    memberContainer: {
        paddingHorizontal: 20,
        flexDirection: 'column',
        marginBottom: 50,
        flex: 1,
    },
    memberView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    text: {
        fontFamily: fonts.NEWYORKEXTRALARGE_BLACK,
        fontWeight: '500',
        fontSize: 18,
        color: colors.BLACK,
    },
    membersLength: {
        fontFamily: fonts.NEWYORKEXTRALARGE_BLACK,
        fontWeight: '500',
        fontSize: 18,
        color: colors.PRIMARY_COLOR,
    },
    seeAll: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: '600',
        fontSize: 15,
        color: colors.PRIMARY_COLOR,
    },
    mediaContainer: {
        paddingHorizontal: 20,
    },
    mediaItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 14,
        marginBottom: 20,
    },
    mediaType: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    mediaTitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
        color: colors.BLACK,
        marginLeft: 15,
    },
    fileView: {
        marginTop: 48,
    },
    inputItem: {
        flexDirection: 'row',
        alignItems: 'center',
    },
});
export default NewChat;
