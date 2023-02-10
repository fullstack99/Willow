import React, { useEffect, useState } from 'react';
import { Animated, View, FlatList, Text, ScrollView, SafeAreaView, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import { useSelector, useDispatch } from 'react-redux';

import { colors, fonts, emoji } from '../../../constants';
import SearchInput from '../../../components/Chat/SearchInput';
import NewGroup from '../../../components/Chat/NewGroup';
import ListItem from '../../../components/Chat/ListItem';
import Header from '../../../components/Chat/Header';
import Alert from '../../../components/Chat/Alert';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import { NEW_PUBLIC_FORUM, CHATTING } from '../../../navigator/constants';
import { updatePublicGroup, leftPublicGroup, getPublicChatRooms, getChatRoom } from '../../../actions/chatAction';

import AddUserSvg from '../../../assets/Images/plus.svg';
import CheckBoxSvg from '../../../assets/Images/check_box.svg';

const { width } = Dimensions.get('screen');

const Public = ({ navigation, show }) => {
    const [visible, setVisible] = useState(false);
    const [selectedGroupId, setSelectGroupId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [isEnabled, setIsEnabled] = useState(null);
    const [search, setSearch] = useState('');
    const { user } = useSelector((state) => state.auth);
    const { publicForums, isLoaded } = useSelector((state) => state.chats);
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(getPublicChatRooms(user.uid));
        return () => setSelectGroupId(null);
    }, []);

    useEffect(() => {
        if (isLoaded) {
            setTimeout(() => {
                if (selectedGroupId) setVisible(true);
                setLoading(false);
            }, 1000);

            const timeOut = setTimeout(() => {
                setVisible(false);
            }, 3000);
            setIsEnabled(timeOut);
        } else {
            setLoading(true);
        }
    }, [publicForums, isLoaded]);

    const goToChat = (item) => {
        dispatch(getChatRoom(item.id));
        setVisible(false);
        navigation.navigate(CHATTING, {
            groupName: item.name,
            members: 0,
            avatar_url: item.avatar_url,
            from: 'public',
        });
    };

    const onSearchSubmit = () => {};

    const handleToggleGroup = (group) => {
        setSelectGroupId(group.id);
        setLoading(true);
        if (isEnabled) {
            clearTimeout(isEnabled);
            setIsEnabled(null);
        }
        const data = {
            joinDate: new Date(),
            userId: user.uid,
        };
        dispatch(updatePublicGroup(group.id, data));
    };

    const renderItem = (item) => (
        <View style={styles.rowOpen}>
            <View style={styles.listView}>
                <ListItem item={item} from="public" onPress={goToChat} />
            </View>
            <TouchableOpacity onPress={() => handleToggleGroup(item)}>
                {item.members && item.members.findIndex((v) => v.userId === user.uid) > -1 ? <CheckBoxSvg /> : <AddUserSvg />}
            </TouchableOpacity>
        </View>
    );

    const message = () => {
        const group = publicForums.find((v) => v.id === selectedGroupId);
        if (group && group.adminApprove && group.members.findIndex((v) => v.userId === user.uid) > -1)
            return 'you have requested to join this room';
        else if (group && !group.adminApprove && group.members.findIndex((v) => v.userId === user.uid) > -1)
            return `you've joined this forum ${emoji.cool}`;
        else return `you've left this forum ${emoji.cool}`;
    };

    return (
        <SafeAreaView style={styles.container}>
            <Header enabledBack={true} title="browse public forums" goBack={() => navigation.goBack()} />
            <LoadingDotsOverlay animation={loading} />
            <View style={styles.top}>
                <SearchInput onSearchSubmit={onSearchSubmit} search={search} setSearch={setSearch} />
            </View>
            <Alert message={message()} onPress={() => setVisible(false)} visible={visible} />
            <View style={styles.typeView}>
                <Text style={styles.text}>most popular forums</Text>
            </View>
            <ScrollView>
                <FlatList
                    data={publicForums}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => renderItem(item)}
                    showsHorizontalScrollIndicator={false}
                />
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
        paddingTop: 30,
    },
    top: {
        backgroundColor: colors.WHITE,
        width: '100%',
        alignItems: 'center',
        paddingHorizontal: 30,
    },
    newGroup: {
        marginTop: 30,
    },
    rowOpen: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        justifyContent: 'space-between',
        width: '100%',
        paddingRight: 20,
    },
    rowBack: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        paddingRight: 20,
        paddingVertical: 10,
    },
    typeView: {
        marginVertical: 20,
        paddingLeft: 30,
    },
    text: {
        fontSize: 13,
        fontFamily: fonts.MULISH_REGULAR,
        color: colors.GREY_1,
    },
    listView: {
        width: width - 90,
    },
});
export default Public;
