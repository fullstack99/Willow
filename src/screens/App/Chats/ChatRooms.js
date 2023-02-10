import React, { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList } from 'react-native';
import { connect, useSelector, useDispatch } from 'react-redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { chatInit } from '../../../actions/chatAction';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import FirebaseChat from '../../../service/firebase_requests/Chat';
import FirebaseErrors from '../../../service/firebase_errors';
import NoChat from '../../../components/Chat/NoChat';
import Toast from '../../../components/Toast';
import SearchInput from '../../../components/Chat/SearchInput';
import ChatRoomListItem from '../../../components/Chat/ChatRoomListItem';
import ChatRoomHiddenItem from '../../../components/Chat/ChatRoomHiddenItem';
import DeleteDialog from '../../../components/Chat/DeleteDialog';

const ChatRooms = ({ navigation }) => {
    const { rooms } = useSelector((state) => state.chats);
    const user = useSelector((state) => state.auth.user);
    const dispatch = useDispatch();
    const [error, setError] = useState('');
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [search, setSearch] = useState('');
    const deleteRef = useRef();

    useEffect(() => {
        const handleRooms = (querySnapshot) => {
            dispatch(
                chatInit(
                    querySnapshot.docs
                        .map((doc) => {
                            return { id: doc.id, ...doc.data() };
                        })
                        .filter((room) => room.latest_message),
                ),
            );
        };
        const unsubscribe = FirebaseChat.getCurrentUserChatRooms(handleRooms, (error) =>
            FirebaseErrors.setError(error, setError),
        );
        return unsubscribe;
    }, []);

    const _sortRoomsOrder = (roomA, roomB) => {
        const roomA_pinned = roomA?.pinned?.indexOf(user?.uid) !== -1;
        const roomB_pinned = roomB?.pinned?.indexOf(user?.uid) !== -1;

        if (roomA_pinned && !roomB_pinned) {
            return -1;
        } else if (roomB_pinned && !roomA_pinned) {
            return 1;
        } else return 0;
    };

    const onDeleteChatRoom = () => {
        if (selectedRoom) {
            FirebaseChat.deleteChatRoom(selectedRoom.id).catch((error) => FirebaseErrors.setError(error, setError));
            deleteRef.current && deleteRef.current.close();
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            {/* <SearchInput search={search} setSearch={setSearch} /> */}
            {rooms.length > 0 ? (
                <SwipeListView
                    data={rooms.sort(_sortRoomsOrder)}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => <ChatRoomListItem navigation={navigation} room={item} />}
                    renderHiddenItem={({ item }, rowMap) => (
                        <ChatRoomHiddenItem room={item} rowMap={rowMap} setSelectedRoom={setSelectedRoom} deleteRef={deleteRef} />
                    )}
                    leftOpenValue={75}
                    rightOpenValue={-75}
                    previewRowKey={'0'}
                    previewOpenValue={-40}
                    previewOpenDelay={3000}
                />
            ) : (
                <NoChat navigation={navigation} />
            )}
            <DeleteDialog
                forwardRef={deleteRef}
                onClose={() => deleteRef.current.close()}
                onDone={() => {}}
                onDelete={onDeleteChatRoom}
            />
        </SafeAreaView>
    );
};

export default ChatRooms;

const styles = StyleSheet.create({
    rowFront: {
        alignItems: 'center',
        backgroundColor: '#CCC',
        borderBottomColor: 'black',
        borderBottomWidth: 1,
        justifyContent: 'center',
        height: 50,
    },
    rowBack: {
        alignItems: 'center',
        backgroundColor: '#DDD',
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingLeft: 15,
    },
});
