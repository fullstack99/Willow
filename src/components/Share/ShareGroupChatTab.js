import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewPropTypes, TouchableOpacity } from 'react-native';
import { useSelector } from 'react-redux';
import PropTypes from 'prop-types';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { colors, fonts } from '../../constants';
import * as DATABASE_CONSTANTS from '../../constants/Database';
import FirebaseUser from '../../service/firebase_requests/User';
import FirebaseChatMessage from '../../service/firebase_requests/ChatMessage';
import FirebaseError from '../../service/firebase_errors';
import CustomFastImage from '../App/CustomFastImage';
import PrivateGroupAvatar from '../Chat/Private/Group/PrivateGroupAvatar';

const ShareGroupChatTab = ({ style, room, data, setError, toggleToastMessage }) => {
    if (!room) return null;
    const user = useSelector((state) => state.auth.user);
    const [member, setMember] = useState([]);
    const [shareRef, setShareRef] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (room.type === 'private_group' && !room?.name) {
            Promise.all(room.members.map((id) => FirebaseUser.getUserById(id)))
                .then(setMember)
                .catch((error) => FirebaseError.setError(error, setError));
        }
    }, [room]);

    const _renderAvatar = () => {
        if (room.type === 'private_group' && !room?.avatar_url) {
            return (
                <View style={{ marginRight: 20 }}>
                    <PrivateGroupAvatar room={room} memberIDs={room.members} style={{ marginHorizontal: 0 }} />
                </View>
            );
        } else {
            return (
                <CustomFastImage
                    source={{ uri: room.avatar_url }}
                    maxWidth={50}
                    maxHeight={50}
                    borderRadius={50 / 2}
                    style={{ marginRight: 20 }}
                />
            );
        }
    };

    const _renderGroupChatName = () => {
        if (room?.name) {
            return room.name;
        } else if (room.type === 'private_group' && Array.isArray(member)) {
            let name = '';
            member.forEach((u, index) => {
                if (index === member.length - 1) {
                    name = name.concat(u.name);
                } else {
                    name = name.concat(`${u.name}, `);
                }
            });
            return name;
        } else {
            return '';
        }
    };

    const _shareToGroupChat = () => {
        setLoading(true);
        if (shareRef) {
            shareRef.delete &&
                shareRef
                    .delete()
                    .then(() => {
                        setShareRef(null);
                    })
                    .catch((error) => FirebaseError.setError(error, setError))
                    .finally(() => setLoading(false));
        } else {
            switch (data.type) {
                case DATABASE_CONSTANTS.TIPS:
                case DATABASE_CONSTANTS.REVIEWS:
                case DATABASE_CONSTANTS.QUESTIONS:
                    return FirebaseChatMessage.sharePost(room, data, user)
                        .then(setShareRef)
                        .catch((error) => FirebaseError.setError(error, setError))
                        .finally(() => {
                            toggleToastMessage && toggleToastMessage();
                            setLoading(false);
                        });
                case 'share_item':
                    return FirebaseChatMessage.shareItem(room, data, user)
                        .then(setShareRef)
                        .catch((error) => FirebaseError.setError(error, setError))
                        .finally(() => {
                            toggleToastMessage && toggleToastMessage();
                            setLoading(false);
                        });
                default:
                    return;
            }
        }
    };

    return (
        <View style={[styles.container, style]}>
            {_renderAvatar()}
            <Text style={styles.name}>{_renderGroupChatName()}</Text>
            <TouchableOpacity style={styles.icon} disabled={loading} onPress={_shareToGroupChat}>
                <MaterialIcons name={shareRef ? 'cancel-schedule-send' : 'send'} size={24} color={colors.PRIMARY_COLOR} />
            </TouchableOpacity>
        </View>
    );
};

ShareGroupChatTab.propTypes = {
    style: ViewPropTypes.style,
    room: PropTypes.shape({
        id: PropTypes.string.isRequired,
        name: PropTypes.string,
        members: PropTypes.arrayOf(PropTypes.string.isRequired).isRequired,
    }).isRequired,
    onPress: PropTypes.func,
    icon: PropTypes.element,
    iconOnPress: PropTypes.func,
};

export default ShareGroupChatTab;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
    name: {
        flex: 1,
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    icon: {
        width: 50,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
