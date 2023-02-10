import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, View, Text, Dimensions, FlatList } from 'react-native';
import { useSelector } from 'react-redux';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';
import { fonts, colors, emoji } from '../../constants';
import { PROFILE, MY_PROFILE, USER_PROFILE } from '../../navigator/constants';
import FirebaseUser from '../../service/firebase_requests/User';

const MessageLikesDialog = ({ forwardRef, navigation, selectedMessage }) => {
    const insets = useSafeAreaInsets();
    const user = useSelector((state) => state.auth.user);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        if (selectedMessage && selectedMessage?.id && Array.isArray(selectedMessage?.likes)) {
            Promise.all(selectedMessage.likes.map((id) => FirebaseUser.getUserById(id)))
                .then(setUsers)
                .catch(console.log);
        }
    }, [selectedMessage?.id, selectedMessage?.likes]);

    const _navigateToUser = (userID) => {
        forwardRef.current && forwardRef.current.close();
        setTimeout(() => {
            if (user?.uid === userID) {
                navigation && navigation.navigate(PROFILE, { screen: MY_PROFILE });
            } else {
                navigation && navigation.push(USER_PROFILE, { userID });
            }
        }, 1000);
    };

    return (
        <RBSheet
            ref={forwardRef}
            animationType={'slide'}
            closeOnDragDown
            dragFromTopOnly
            openDuration={300}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <View style={[styles.container, { marginBottom: insets.bottom }]}>
                <Text style={styles.title}>likes {emoji.heart}</Text>
                <FlatList
                    keyExtractor={(item) => item.uid}
                    data={users}
                    renderItem={({ item }) => (
                        <View style={styles.userContainer}>
                            <TouchableOpacity onPress={() => _navigateToUser(item.uid)}>
                                <FastImage
                                    source={{ uri: item?.avatar_url }}
                                    resizeMode={FastImage.resizeMode.contain}
                                    style={styles.avatar}
                                />
                            </TouchableOpacity>
                            <View style={styles.nameContainer}>
                                <Text style={styles.name}>{item?.name}</Text>
                                <Text style={styles.username}>{item?.username}</Text>
                            </View>
                        </View>
                    )}
                    style={styles.container}
                />
            </View>
        </RBSheet>
    );
};

export default MessageLikesDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        paddingHorizontal: 20,
        height: Dimensions.get('window').height * 0.5,
    },
    container: {
        flex: 1,
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 20,
        textAlign: 'center',
        paddingBottom: 10,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    nameContainer: {
        flex: 1,
        marginLeft: 20,
    },
    name: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        paddingBottom: 5,
    },
    username: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 12,
        color: colors.GREY_2,
    },
});
