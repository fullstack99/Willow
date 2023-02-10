import React, { useEffect, useState } from 'react';
import { View, SafeAreaView, StyleSheet, FlatList, ActivityIndicator, Text, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

import { colors, fonts } from '../../../../constants';
const { width } = Dimensions.get('screen');

const Questions = () => {
    const data = [
        {
            id: 1,
            title: 'General Stroller Guide | Which Stroller Do I Purchase?1',
            date: 'Feb 13, 2021',
            description:
                'That are the best strollers of 2020? Check out this Magic Beans stroller review video for a full rundown of our favorite strollers of',
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
        {
            id: 2,
            title: 'General Stroller Guide | Which Stroller Do I Purchase?1',
            date: 'Feb 13, 2021',
            description:
                'That are the best strollers of 2020? Check out this Magic Beans stroller review video for a full rundown of our favorite strollers of',
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
        },
    ];

    const _renderItem = (item) => {
        return (
            <View style={styles.itemContainer}>
                <View style={{ flexDirection: 'row' }}>
                    <FastImage source={{ uri: item.avatar }} style={styles.avatar} />
                    <View style={styles.itemInfo}>
                        <Text style={styles.title} numberOfLines={1} ellipsizeMode="tail">
                            {item.title}
                        </Text>
                        <Text style={styles.date}>{item.date}</Text>
                    </View>
                </View>
                <Text style={styles.description} numberOfLines={2} ellipsizeMode="tail">
                    {item.description}
                </Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={data}
                renderItem={({ item }) => _renderItem(item)}
                keyExtractor={(item) => item.id}
                showsHorizontalScrollIndicator={false}
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
        marginTop: 30,
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 13,
        fontFamily: fonts.MULISH_REGULAR,
        color: colors.GREY_1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    itemContainer: {
        paddingHorizontal: 20,
        paddingVertical: 20,
        marginBottom: 20,
        backgroundColor: colors.WHITE,
        borderRadius: 25,
        borderColor: colors.WHITE_3,
        borderWidth: 1,
    },
    title: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
        fontWeight: 'bold',
        color: colors.BLACK,
        lineHeight: 20,
        width: width - 150,
    },
    description: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.BLACK,
        lineHeight: 22,
        marginTop: 10,
        width: width - 110,
    },
    date: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.GREY_2,
    },
    itemInfo: {
        marginLeft: 10,
    },
});

export default Questions;
