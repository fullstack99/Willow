import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, FlatList, Keyboard, TouchableWithoutFeedback } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';
import { CommonActions } from '@react-navigation/native';
import { createChat } from '../../../actions/chatAction';
import { fonts, colors } from '../../../constants';
import { CHATS, CHATTING } from '../../../navigator/constants';
import GlobalStyles from '../../../constants/globalStyles';
import FirebaseChat from '../../../service/firebase_requests/Chat';
import UserService from '../../../service/firebase_requests/User';
import EThreeService from '../../../service/virgil_security';
import FirebaseErrors from '../../../service/firebase_errors';
import { sortArrayByName } from '../../../utility';
import Toast from '../../../components/Toast';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import Button from '../../../components/Button';
import User from '../../../components/Chat/User';
import SearchInput from '../../../components/Chat/SearchInput';

const NewChat = ({ navigation }) => {
    const { user, following } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [friends, setFriends] = useState([]);
    const [selectedFriends, setSelectedFriends] = useState([]);
    const [search, setSearch] = useState('');

    useEffect(() => {
        Promise.all(
            FirebaseChat.getCurrentUserFriendList(following)
                .filter((u) => !u?.isAdmin)
                .map((u) => UserService.getUserById(u.uid)),
        ).then((res) => setFriends(res));
    }, [following]);

    const toggleFriend = (item) => {
        if (selectedFriends.findIndex((f) => f.uid === item.uid) === -1) {
            setSelectedFriends([...selectedFriends, item]);
        } else {
            setSelectedFriends(selectedFriends.filter((f) => f.uid !== item.uid));
        }
    };

    const handleNext = () => {
        setLoading(true);
        const selectedFriendsIDS = selectedFriends.map((f) => f.uid);
        const data = {
            owner: user.uid,
            type: selectedFriends.length === 1 ? 'direct_message' : 'private_group',
            members: [user.uid, ...selectedFriendsIDS],
            admin_approval: false,
        };
        if (selectedFriends.length === 0) return;
        else if (selectedFriends.length > 1) {
            Promise.all([
                FirebaseChat.createChatRoom(data),
                EThreeService.getGroupMembersCard(data.members),
                EThreeService.findUsers(selectedFriendsIDS),
            ])
                .then((res) => {
                    const room = res[0];
                    const memberCard = res[1];
                    const participants = res[2];
                    EThreeService.getEthree()
                        .getGroup(room.id)
                        .then((groupRes) => {
                            if (groupRes) {
                                room.get().then((roomDoc) => {
                                    navigation.dispatch(
                                        CommonActions.reset({
                                            index: 1,
                                            routes: [
                                                { name: CHATS },
                                                {
                                                    name: CHATTING,
                                                    params: { room: { id: roomDoc.id, ...roomDoc.data() }, memberCard },
                                                },
                                            ],
                                        }),
                                    );
                                });
                            } else {
                                EThreeService.getEthree()
                                    .createGroup(room.id, participants)
                                    .then(() => {
                                        room.get().then((roomDoc) => {
                                            navigation.dispatch(
                                                CommonActions.reset({
                                                    index: 1,
                                                    routes: [
                                                        { name: CHATS },
                                                        {
                                                            name: CHATTING,
                                                            params: { room: { id: roomDoc.id, ...roomDoc.data() }, memberCard },
                                                        },
                                                    ],
                                                }),
                                            );
                                        });
                                    })
                                    .catch(console.log);
                            }
                        });
                })
                .catch((error) => FirebaseErrors.setError(error, setError))
                .finally(() => setLoading(false));
        } else {
            Promise.all([FirebaseChat.createChatRoom(data), EThreeService.getEthree().findUsers(selectedFriendsIDS[0])])
                .then((res) => {
                    const room = res[0];
                    const memberCard = res[1];
                    room.get().then((roomDoc) => {
                        navigation.dispatch(
                            CommonActions.reset({
                                index: 1,
                                routes: [
                                    { name: CHATS },
                                    { name: CHATTING, params: { room: { id: roomDoc.id, ...roomDoc.data() }, memberCard } },
                                ],
                            }),
                        );
                    });
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

export default NewChat;

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
