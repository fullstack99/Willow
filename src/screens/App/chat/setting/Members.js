import React, { useState, useEffect, useRef } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList, ActivityIndicator, Text, TouchableOpacity } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import FastImage from 'react-native-fast-image';

import { colors, fonts } from '../../../../constants';
import Header from '../../../../components/Chat/Header';
import ListItem from '../../../../components/Chat/ListItem';
import DeleteMemberDialog from '../../../../components/Chat/DeleteMemberDialog';
import LoadingDotsOverlay from '../../../../components/LoadingDotsOverlay';
import { handleDeleteMembers } from '../../../../actions/chatAction';

import DeleteSvg from '../../../../assets/Images/Chat/chat-delete.svg';
import CheckBoxSvg from '../../../../assets/Images/check_box.svg';
import AvatarIcon from '../../../../assets/Images/avatar.png';

const Members = ({ navigation, show, route }) => {
    const { from } = route.params;
    const { user } = useSelector((state) => state.auth);
    const { currentGroup, isLoading, isLoaded } = useSelector((state) => state.chats);
    const [permission, setPermisstion] = useState('member');
    const [isEditabled, setEditabled] = useState(false);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [refresh, setRefresh] = useState(false);
    const [visibleDelete, setVisibleDelete] = useState(false);
    const [loading, setLoading] = useState(false);
    const deleteRef = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        if (currentGroup.owner === user.uid) setPermisstion('admin');
        if (loading && isLoaded && !isLoading) setLoading(false);
    }, [currentGroup]);

    useEffect(() => {
        if (!isEditabled) {
            setVisibleDelete(false);
            setSelectedUsers([]);
            setLoading(false);
        }
    }, [isEditabled]);

    const goBack = () => navigation.goBack();

    const toggleUsers = (user) => {
        if (!isEditabled) return;
        const index = selectedUsers.findIndex((v) => v.uid === user.uid);
        if (index > -1) {
            selectedUsers.splice(index, 1);
        } else {
            selectedUsers.push(user);
        }
        if (selectedUsers.length > 0) setVisibleDelete(true);
        else setVisibleDelete(false);
        setRefresh(!refresh);
        setSelectedUsers(selectedUsers);
    };

    const showDeleteModal = () => deleteRef.current.open && deleteRef.current.open();

    const handleDelete = () => {
        setLoading(true);
        deleteRef.current.close();
        const ids = selectedUsers.map((v) => v.uid);
        dispatch(handleDeleteMembers(currentGroup.id, { users: ids }));
    };

    const renderDeleteMemberDialogSheet = () => {
        return (
            <DeleteMemberDialog
                deleteRef={deleteRef}
                onClose={() => deleteRef.current.close()}
                onDone={(phone) => {}}
                onDelete={handleDelete}
            />
        );
    };

    const _renderIcon = () => {
        return <>{permission === 'admin' ? <Text style={styles.headerIcon}>{isEditabled ? 'cancel' : 'edit'}</Text> : null}</>;
    };

    const _renderStatus = (status) => {
        let userStatus = '';
        status.forEach((v, index) => {
            if (index !== status.length - 1) {
                userStatus += v + ', ';
            } else {
                userStatus += v;
            }
        });
        return userStatus ? userStatus : 'no status';
    };

    const _renderRow = (item) => {
        return (
            <TouchableOpacity style={styles.listItem} onPress={() => toggleUsers(item)}>
                <View style={styles.user}>
                    <FastImage style={styles.avatar} source={item.avatar_url ? { uri: item.avatar_url } : AvatarIcon} />

                    <View style={styles.userInfo}>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                            {item.name}
                        </Text>
                        <Text style={styles.username}>{_renderStatus(item.status)}</Text>
                    </View>
                </View>
                <>
                    {item.uid === currentGroup.owner && currentGroup.roomType === 'new_public_forum' ? (
                        <Text style={styles.owner}>owner</Text>
                    ) : (
                        selectedUsers.findIndex((v) => v.uid === item.uid) > -1 && <CheckBoxSvg />
                    )}
                </>
            </TouchableOpacity>
        );
    };

    return (
        <>
            <LoadingDotsOverlay animation={loading} />
            <SafeAreaView style={styles.container}>
                <Header
                    enabledBack={true}
                    title="members"
                    goBack={goBack}
                    icon={_renderIcon()}
                    onPress={() => setEditabled(!isEditabled)}
                />
                <FlatList
                    data={currentGroup.members}
                    renderItem={({ item }) => _renderRow(item)}
                    keyExtractor={(item) => item.uid}
                    showsHorizontalScrollIndicator={false}
                    style={styles.list}
                    extraData={refresh}
                />
                {visibleDelete && (
                    <TouchableOpacity onPress={showDeleteModal}>
                        <DeleteSvg />
                    </TouchableOpacity>
                )}
                {renderDeleteMemberDialogSheet()}
            </SafeAreaView>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
        alignItems: 'center',
        paddingTop: 30,
    },
    list: {
        flex: 1,
        width: '100%',
        marginTop: 20,
    },
    headerIcon: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.PRIMARY_COLOR,
    },
    listItem: {
        flexDirection: 'row',
        marginTop: 20,
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 20,
        width: '100%',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    },
    userInfo: {
        width: '60%',
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
    username: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.GREY_2,
        marginTop: 3,
    },
});
export default Members;
