import React, { useState } from 'react';
import { View, Image, Text, StyleSheet, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { colors, fonts } from '../../constants';
import { USER_PROFILE } from '../../navigator/constants';
import deleteIcon from '../../assets/Images/delete.png';
import CheckSvg from '../../assets/Images/check-small.svg';

const User = ({ item, onPress, enableDelete, selected }) => {
    if (enableDelete) {
        return (
            <TouchableOpacity style={styles.container} onPress={onPress}>
                <View>
                    <FastImage
                        style={styles.avatar}
                        source={{ uri: item.avatar_url }}
                        resizeMode={FastImage.resizeMode.contain}
                    />

                    <TouchableOpacity onPress={onPress}>
                        <FastImage style={styles.delete} source={deleteIcon} />
                    </TouchableOpacity>
                </View>
                <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                    {item.name}
                </Text>
            </TouchableOpacity>
        );
    } else {
        return (
            <TouchableOpacity style={styles.tabContainer} onPress={onPress}>
                <FastImage
                    style={[styles.avatar, { marginRight: 20 }]}
                    source={{ uri: item.avatar_url }}
                    resizeMode={FastImage.resizeMode.contain}
                />
                <View style={styles.tabUserContainer}>
                    <Text style={styles.tabName}>{item.name}</Text>
                    <Text style={styles.tabUsername}>{item?.username}</Text>
                </View>
                {selected && <CheckSvg />}
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    container: {
        width: 50,
        height: 76,
        marginRight: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
    },
    name: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.BLACK_1,
        marginTop: 10,
    },
    delete: {
        width: 16,
        height: 16,
        position: 'absolute',
        right: 0,
        bottom: 0,
    },
    tabContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        alignItems: 'center',
        height: 50,
    },
    tabUserContainer: {
        flex: 1,
        height: '100%',
        justifyContent: 'space-evenly',
        paddingRight: 20,
    },
    tabName: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
    tabUsername: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: '#9D9D9D',
    },
});
export default User;
