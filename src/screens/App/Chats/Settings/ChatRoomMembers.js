import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, TouchableOpacity } from 'react-native';
import GlobalStyles from '../../../../constants/globalStyles';
import FirebaseChat from '../../../../service/firebase_requests/Chat';
import FirebaseErrors from '../../../../service/firebase_errors';
import Toast from '../../../../components/Toast';
import LoadingDotsOverlay from '../../../../components/LoadingDotsOverlay';
import MemberScreenTab from '../../../../components/Chat/Member/MemberScreenTab';

const ChatRoomMembers = ({ navigation, route }) => {
    const roomID = route.params.roomID;
    const [error, setError] = useState('');
    const [room, setRoom] = useState(null);
    const [members, setMembers] = useState(null);
    useEffect(() => {
        const onMembers = (querySnapshot) => {
            setMembers(
                querySnapshot.docs.map((member) => {
                    return { uid: member.id, ...member.data() };
                }) || [],
            );
        };
        const unsubscribe = FirebaseChat.getChatMembers(roomID, onMembers, (error) => FirebaseErrors.setError(error, setError));

        return unsubscribe;
    }, [roomID]);

    useEffect(() => {
        const onRoom = (roomSnapshot) => {
            setRoom({ id: roomSnapshot.id, ...roomSnapshot.data() });
        };
        const unsubscribe = FirebaseChat.getChatRoom(roomID, onRoom, (error) => FirebaseErrors.setError(error, setError));

        return unsubscribe;
    }, [roomID]);
    if (!roomID) return <View />;
    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={!members} />
            {Array.isArray(members) && (
                <FlatList
                    keyExtractor={(item) => item.uid}
                    data={members}
                    renderItem={({ item }) => (
                        <MemberScreenTab
                            navigation={navigation}
                            member={item}
                            isAdmin={Array.isArray(room?.admin) ? room.admin.indexOf(item.uid) !== -1 : false}
                        />
                    )}
                    contentContainerStyle={{ flexGrow: 1, marginVertical: 20, paddingHorizontal: 20 }}
                />
            )}
        </SafeAreaView>
    );
};

export default ChatRoomMembers;

const styles = StyleSheet.create({});
