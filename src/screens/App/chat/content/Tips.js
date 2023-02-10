import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { colors } from '../../../../constants';
import ContentItem from '../../../../components/Chat/ContentItem';

const Tips = ({ navigation, show }) => {
    const data = [
        {
            id: 1,
            description: 'Chest of 3 drawers white',
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 2,
            description: 'Chest of 3 drawers white',
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 3,
            description: 'Chest of 3 drawers white',
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 4,
            description: 'Chest of 3 drawers white',
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 5,
            description: 'Chest of 3 drawers white',
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) => <ContentItem item={item} />}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
                numColumns={2}
                style={styles.list}
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
        justifyContent: 'center',
        alignItems: 'center',
    },
    list: {
        flex: 1,
        width: '100%',
        marginTop: 30,
    },
});
export default Tips;
