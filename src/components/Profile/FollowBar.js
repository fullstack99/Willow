import React, { useRef, useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import auth from '@react-native-firebase/auth';
import FastImage from 'react-native-fast-image';
import { fonts, colors } from '../../constants';
import * as USER_CONSTANTS from '../../constants/User';
import * as NAVIGATOR_CONSTANTS from '../../navigator/constants';
import User from '../../service/firebase_requests/User';
import FirebaseChat from '../../service/firebase_requests/Chat';
import EThreeService from '../../service/virgil_security';
import Button from '../Button';
import FollowingDialog from '../Dialogs/FollowingDialog';
import ChatIcon from '../../assets/Images/chat.png';

const FollowBar = ({ navigation, user, setError, loading, setLoading, setStatus, status }) => {
    if (!user || !user.uid || !user.username || !auth().currentUser) return null;
    const currentUser = useSelector((state) => state.auth.user);
    const privateUser = user[USER_CONSTANTS.PRIVACY_PREFERENCE] === 'private';
    const followingDialogRef = useRef();
    const chattable = user?.role !== 'admin' && status?.mutualFriend && currentUser?.role !== 'admin' ? true : false;
    const [chatRoomRef, setChatRoomRef] = useState(null);
    const [chatMemberCard, setChatMemberCard] = useState(null);

    useEffect(() => {
        if (chattable && !chatRoomRef) {
            FirebaseChat.getDirectMessageChatRoomByUserID(user.uid).then(setChatRoomRef).catch(console.log);
            EThreeService.getEthree()?.findUsers &&
                EThreeService.getEthree().findUsers(user.uid).then(setChatMemberCard).catch(console.log);
        }
    }, [chattable, chatRoomRef]);

    useEffect(() => {
        const unsubscribe = User.retrieveFollowingStatus(
            user.uid,
            (querySnapshot) => {
                if (querySnapshot.size === 1) {
                    setStatus({ id: querySnapshot.docs[0].id, ...querySnapshot.docs[0].data() });
                } else {
                    setStatus(null);
                }
            },
            (error) => FirebaseErrors.setError(error, setError),
        );

        return unsubscribe;
    }, [user.uid, setStatus]);

    const _followOnPress = () => {
        if (status) {
            followingDialogRef.current && followingDialogRef.current.open();
        } else {
            setLoading(true);
            if (privateUser) {
                User.requestToFollowUserById(user.uid)
                    .catch((error) => {
                        FirebaseError.setError(error, setError);
                    })
                    .finally(() => setLoading(false));
            } else {
                User.followUserById(user.uid)
                    .catch((error) => {
                        FirebaseError.setError(error, setError);
                    })
                    .finally(() => setLoading(false));
            }
        }
    };

    const _renderFollowButtonText = () => {
        if (!status) return 'follow';
        else if (status.pending) return 'requested';
        else if (status.mutualFriend) return 'we are friends 😄';
        else return 'following';
    };

    const _navigateToChatRoom = () => {
        if (!chattable || !auth().currentUser) return;
        if (chatRoomRef && chatMemberCard) {
            return (
                navigation &&
                navigation.navigate(NAVIGATOR_CONSTANTS.CHAT, {
                    screen: NAVIGATOR_CONSTANTS.CHATTING,
                    initial: false,
                    params: { room: { id: chatRoomRef.id, ...chatRoomRef.data() }, memberCard: chatMemberCard },
                })
            );
        } else {
            setLoading(true);
            const data = {
                owner: currentUser.uid,
                type: 'direct_message',
                members: [user.uid, currentUser.uid],
            };
            Promise.all([FirebaseChat.createChatRoom(data), EThreeService.getEthree().findUsers(user.uid)]).then((res) => {
                const room = res[0];
                const memberCard = res[1];
                room.get()
                    .then((roomDoc) => {
                        setLoading(false);
                        return (
                            navigation &&
                            navigation.navigate(NAVIGATOR_CONSTANTS.CHAT, {
                                screen: NAVIGATOR_CONSTANTS.CHATTING,
                                initial: false,
                                params: { room: { id: roomDoc.id, ...roomDoc.data() }, memberCard },
                            })
                        );
                    })
                    .catch((error) => {
                        setLoading(false);
                        console.log(error);
                    });
            });
        }
    };

    return (
        <View style={styles.userActionsContainer}>
            <View style={{ marginRight: 5 }}>
                <Button
                    width={190}
                    height={60}
                    disabled={loading}
                    disabledColor={colors.GREY}
                    style={{
                        marginBottom: 0,
                        backgroundColor: status ? colors.GREY : colors.PRIMARY_COLOR,
                    }}
                    textStyle={{
                        color: status ? colors.DARK_GREY : colors.WHITE,
                    }}
                    onPress={_followOnPress}>
                    {_renderFollowButtonText()}
                </Button>
            </View>
            {chattable && (
                <TouchableOpacity disabled={loading} style={styles.chatButtonContainer} onPress={_navigateToChatRoom}>
                    <FastImage source={ChatIcon} resizeMode={FastImage.resizeMode.contain} style={{ width: 20, height: 20 }} />
                </TouchableOpacity>
            )}

            <FollowingDialog
                forwardRef={followingDialogRef}
                user={user}
                loading={loading}
                setLoading={setLoading}
                setError={setError}
            />
        </View>
    );
};

export default FollowBar;

const styles = StyleSheet.create({
    userActionsContainer: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
    },
    chatButtonContainer: {
        height: 60,
        width: 60,
        marginTop: 20,
        marginLeft: 5,
        borderWidth: 2,
        borderColor: colors.GREY,
        borderRadius: 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
