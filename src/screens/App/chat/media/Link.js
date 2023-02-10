import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, SafeAreaView, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import FastImage from 'react-native-fast-image';

import { colors, fonts } from '../../../../constants';

const { width } = Dimensions.get('screen');

const Link = ({ navigation, show }) => {
    const data = [
        {
            id: 1,
            title: 'General Stroller Guide | Which Stroller Do I Purchase?1',
            description:
                'That are the best strollers of 2020? Check out this Magic Beans stroller review video for a full rundown of our favorite strollers of',
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
            link: 'https://www.youtube.com/watch?v=jgRsD35G8jE',
        },
        {
            id: 2,
            title: 'General Stroller Guide | Which Stroller Do I Purchase?2',
            description:
                'That are the best strollers of 2020? Check out this Magic Beans stroller review video for a full rundown of our favorite strollers of',
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
            link: 'https://www.youtube.com/watch?v=jgRsD35G8jE',
        },
        {
            id: 3,
            title: 'General Stroller Guide | Which Stroller Do I Purchase?3',
            description:
                'That are the best strollers of 2020? Check out this Magic Beans stroller review video for a full rundown of our favorite strollers of...',
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
            link: 'https://www.youtube.com/watch?v=jgRsD35G8jE',
        },
        {
            id: 10,
            title: 'General Stroller Guide | Which Stroller Do I Purchase?5',
            description:
                'That are the best strollers of 2020? Check out this Magic Beans stroller review video for a full rundown of our favorite strollers of...',
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
            link: 'https://www.youtube.com/watch?v=jgRsD35G8jE',
        },
        {
            id: 5,
            title: 'General Stroller Guide | Which Stroller Do I Purchase?6',
            description:
                'That are the best strollers of 2020? Check out this Magic Beans stroller review video for a full rundown of our favorite strollers of...',
            avatar: 'https://m.media-amazon.com/images/I/71sYf5ZwVRL._AC_UY218_.jpg',
            link: 'https://www.youtube.com/watch?v=jgRsD35G8jE',
        },
    ];

    const _renderItem = (item) => {
        return (
            <View style={styles.itemContainer}>
                <FastImage source={{ uri: item.avatar }} style={styles.avatar} />
                <View style={styles.itemInfo}>
                    <Text style={styles.title} numberOfLines={2} ellipsizeMode="tail">
                        {item.title}
                    </Text>
                    <Text style={styles.description} numberOfLines={3} ellipsizeMode="tail">
                        {item.description}
                    </Text>
                    <Text style={styles.link}>{item.link}</Text>
                </View>
            </View>
        );
    };

    if (!show) {
        return null;
    }
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
    },
    text: {
        fontSize: 13,
        fontFamily: fonts.MULISH_REGULAR,
        color: colors.GREY_1,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 15,
    },
    itemContainer: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        marginBottom: 20,
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
        fontSize: 13,
        color: colors.GREY_2,
        lineHeight: 16,
        marginVertical: 5,
    },
    link: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.PRIMARY_COLOR,
        lineHeight: 16,
    },
    itemInfo: {
        marginLeft: 20,
        width: width - 110,
    },
});

export default Link;
