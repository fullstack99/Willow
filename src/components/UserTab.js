import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { fonts, colors } from '../constants';
import User from '../service/firebase_requests/User';
import FirebaseErrors from '../service/firebase_errors';

const UserTab = ({ user, onPress, icon, disabled, iconOnPress, setError }) => {
    if (!user) return null;

    if (onPress) {
        return (
            <TouchableOpacity style={styles.userContainer} onPress={() => onPress(user.uid || user.objectID)}>
                <FastImage source={{ uri: user.avatar_url }} resizeMode="contain" style={styles.userAvatar} />
                <View style={styles.nameContainer}>
                    <Text style={styles.name} numberOfLines={1}>
                        {user.name}
                    </Text>
                    <Text style={styles.username} numberOfLines={1}>
                        {user.username}
                    </Text>
                </View>
                {icon && iconOnPress && (
                    <TouchableOpacity style={styles.icon} disabled={disabled} onPress={() => iconOnPress(user)}>
                        {icon}
                    </TouchableOpacity>
                )}
            </TouchableOpacity>
        );
    } else {
        return (
            <View style={styles.userContainer}>
                <FastImage source={{ uri: user.avatar_url }} resizeMode="contain" style={styles.userAvatar} />
                <View style={styles.nameContainer}>
                    <Text style={styles.name} numberOfLines={1}>
                        {user.name}
                    </Text>
                    <Text style={styles.username} numberOfLines={1}>
                        {user.username}
                    </Text>
                </View>
                {icon && iconOnPress && (
                    <TouchableOpacity style={styles.icon} disabled={disabled} onPress={() => iconOnPress(user)}>
                        {icon}
                    </TouchableOpacity>
                )}
            </View>
        );
    }
};

export default UserTab;

const styles = StyleSheet.create({
    userContainer: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: 20,
        marginVertical: 15,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    nameContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        marginHorizontal: 20,
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
    },
    username: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
    },
    icon: {
        justifyContent: 'center',
        alignItems: 'center',
        width: 50,
        height: 50,
    },
});
