import React, { useEffect, useState } from 'react';
import { View, Text, SafeAreaView, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

import { colors } from '../../../../constants';
import ContentItem from '../../../../components/Chat/ContentItem';

const Reviews = () => {
    const data = [
        {
            id: 1,
            description: 'Chest of 3 drawers white',
            price: 20,
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 2,
            description: 'Chest of 3 drawers white',
            price: 20,
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 3,
            description: 'Chest of 3 drawers white',
            price: 20,
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 4,
            description: 'Chest of 3 drawers white',
            price: 20,
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 5,
            description: 'Chest of 3 drawers white',
            price: 20,
            thumbail: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <View>
                <Text>Review Page</Text>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        width: '100%',
        alignItems: 'center',
    },
    list: {
        flex: 1,
        width: '100%',
        marginTop: 30,
    },
});
export default Reviews;
