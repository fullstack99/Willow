import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useSelector } from 'react-redux';
import { fonts, colors } from '../../../../constants';
import { CHATS, CHATTING } from '../../../../navigator/constants';
import GlobalStyles from '../../../../constants/globalStyles';
import FirebaseChat from '../../../../service/firebase_requests/Chat';
import FirebaseUser from '../../../../service/firebase_requests/User';
import EThreeService from '../../../../service/virgil_security';
import FirebaseErrors, { INVALID_ARGUMENTS } from '../../../../service/firebase_errors';
import { sortArrayByName } from '../../../../utility';
import Toast from '../../../../components/Toast';
import LoadingDotsOverlay from '../../../../components/LoadingDotsOverlay';
import Button from '../../../../components/Button';
import User from '../../../../components/Chat/User';
import SearchInput from '../../../../components/Chat/SearchInput';

const AddRoomMembers = ({ navigation, route }) => {
    const { user, following } = useSelector((state) => state.auth);
    const roomID = route.params?.roomID || null;
    if (!roomID) return null;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [room, setRoom] = useState(null);
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        const onRoom = (documentSnapshot) => {
            if (documentSnapshot.exists) {
                setRoom({ id: documentSnapshot.id, ...documentSnapshot.data() });
            }
        };
        const unsubscribe = FirebaseChat.getChatRoom(roomID, onRoom, (error) => FirebaseErrors.setError(error, setError));

        return unsubscribe;
    }, [roomID]);

    useEffect(() => {
        if (Array.isArray(room?.members)) {
            Promise.all(
                FirebaseChat.getCurrentUserFriendList(following)
                    .filter((u) => !u?.isAdmin && room.members.indexOf(u.uid) === -1)
                    .map((u) => FirebaseUser.getUserById(u.uid)),
            ).then((res) => setFriends(res));
        }
    }, [room?.members, following]);

    const toggleFriend = (item) => {
        if (selectedFriends.findIndex((f) => f.uid === item.uid) === -1) {
            setSelectedFriends([...selectedFriends, item]);
        } else {
            setSelectedFriends(selectedFriends.filter((f) => f.uid !== item.uid));
        }
    };

    const handleNext = () => {
        const selectedFriendsIDS = selectedFriends.map((f) => f.uid);

        if (selectedFriendsIDS.length === 0) return;
        else {
            setLoading(true);
            const addNewUsersInFirebase = () => {
                return new Promise((resolve, reject) => {
                    FirebaseChat.addNewMembersToChatRoom(roomID, selectedFriendsIDS)
                        .then(resolve)
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                });
            };

            const addNewUsersInVirgil = () => {
                return new Promise((resolve, reject) => {
                    if (!room || !room?.owner || room.owner !== user.uid) {
                        reject({ code: INVALID_ARGUMENTS });
                        return;
                    }

                    return Promise.all([
                        EThreeService.getGroupEThree(roomID, room.owner),
                        ...selectedFriendsIDS.map((id) => EThreeService.findUsers(id)),
                    ])
                        .then((response) => {
                            const groupEThree = response[0];
                            Promise.all(
                                response.slice(1, response.length).map((participantCard) => groupEThree.reAdd(participantCard)),
                            )
                                .then(() =>
                                    groupEThree
                                        .update()
                                        .then(resolve)
                                        .catch((error) => {
                                            reject(error);
                                            return;
                                        }),
                                )
                                .catch((error) => {
                                    reject(error);
                                    return;
                                });
                        })
                        .catch((error) => {
                            reject(error);
                            return;
                        });
                });
            };

            return Promise.all([addNewUsersInFirebase(), addNewUsersInVirgil()])
                .then(() => {
                    return navigation && navigation.pop(2);
                })
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        }
    };

    return (
        <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <SafeAreaView style={GlobalStyles.container}>
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <LoadingDotsOverlay animation={loading} />

                <View style={styles.container}>
                    <View style={styles.top}>
                        <SearchInput search={search} setSearch={setSearch} />
                    </View>

                    {selectedFriends.length > 0 && (
                        <View style={styles.section}>
                            <Text style={styles.userNum}>
                                added {selectedFriends.length} from {sortArrayByName(friends, search).length}
                            </Text>
                            <FlatList
                                data={selectedFriends}
                                renderItem={({ item }) => <User item={item} onPress={() => toggleFriend(item)} enableDelete />}
                                keyExtractor={(item) => item.uid}
                                pagingEnabled
                                showsHorizontalScrollIndicator={false}
                                horizontal
                            />
                        </View>
                    )}
                    <View style={styles.section}>
                        <Text style={styles.userNum}>friends on Willow ({sortArrayByName(friends, search).length})</Text>
                        <FlatList
                            data={sortArrayByName(friends, search)}
                            renderItem={({ item }) => (
                                <User
                                    item={item}
                                    onPress={() => toggleFriend(item)}
                                    selected={selectedFriends.findIndex((f) => f.uid === item.uid) !== -1}
                                />
                            )}
                            keyExtractor={(item) => item.uid}
                        />
                    </View>
                </View>

                <Button onPress={handleNext} disabled={selectedFriends.length === 0}>
                    next
                </Button>
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default AddRoomMembers;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
    },
    top: {
        backgroundColor: colors.WHITE,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    newGroup: {
        marginTop: 30,
    },
    list: {
        flex: 1,
        width: '100%',
    },
    section: {
        paddingHorizontal: 20,
        marginVertical: 20,
    },
    userNum: {
        marginBottom: 20,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.BLACK_2,
        opacity: 0.4,
    },
    chatCount: {
        paddingHorizontal: 20,
    },
});
