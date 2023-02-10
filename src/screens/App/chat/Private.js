import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { colors } from '../../../constants';
import SearchInput from '../../../components/Chat/SearchInput';
import NewGroup from '../../../components/Chat/NewGroup';
import ListItem from '../../../components/Chat/ListItem';
import { NEW_GRUOP, NEW_PUBLIC_FORUM } from '../../../navigator/constants';

const Private = ({ navigation, show }) => {
    const [stickyHeaderIndices, setStickyHeaderIndices] = useState([]);

    const data = [
        { name: 'Choose group to duplicate members', header: true },
        {
            id: 1,
            name: 'Bill Moriss1',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 2,
            name: 'Bill Moriss2',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 3,
            name: 'Bill Moriss3',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 4,
            name: 'Bill Moriss4',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 10,
            name: 'Bill Moriss5',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 5,
            name: 'Bill Moriss6',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 6,
            name: 'Bill Moriss7',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 7,
            name: 'Bill Moriss8',
            username: '@bill',
            header: false,
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
    ];

    useEffect(() => {
        let arr = [];
        data.map((obj) => {
            if (obj.header) {
                arr.push(data.indexOf(obj));
            }
        });
        arr.push(0);
        setStickyHeaderIndices(arr);
    }, []);

    const createNewGroup = () => navigation.navigate(NEW_GRUOP, { title: 'new group' });
    const handleDirectMessage = () => navigation.navigate(NEW_GRUOP, { from: 'private_message', title: 'new direct message' });

    const goToChat = (item) => {
        navigation.navigate(NEW_PUBLIC_FORUM, {
            selectedUsers: data,
        });
    };

    if (!show) {
        return null;
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.top}>
                <SearchInput />
                <NewGroup title="New direct Message" containerStyle={styles.newGroup} onPress={handleDirectMessage} />
                <NewGroup title="New group" containerStyle={styles.newGroup} onPress={createNewGroup} />
            </View>
            <FlatList
                data={data}
                renderItem={({ item }) => <ListItem item={item} onPress={goToChat} />}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                stickyHeaderIndices={stickyHeaderIndices}
                ListHeaderComponent={data.length > 0 ? null : <ActivityIndicator />}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
        alignItems: 'center',
        marginTop: 30,
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
        marginTop: 30,
    },
});
export default Private;
