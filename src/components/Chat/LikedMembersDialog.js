import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';

import { fonts, colors } from '../../constants';
const { height } = Dimensions.get('screen');

const LikedMembersDialog = ({ likedMembersDialogRef, members, likedMembers }) => {
    const _renderRow = (item) => {
        return (
            <View style={styles.renderItem}>
                <View style={styles.userInfo}>
                    <FastImage style={styles.avatar} source={{ uri: item.avatar_url }} />
                    <View>
                        <Text style={styles.name} numberOfLines={1} ellipsizeMode="tail">
                            {item.name}
                        </Text>
                        <Text style={styles.username} numberOfLines={1} ellipsizeMode="tail">
                            {item.username}
                        </Text>
                    </View>
                </View>
            </View>
        );
    };

    return (
        <RBSheet
            ref={likedMembersDialogRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: { ...styles.dialogContainer, maxHeight: height * 0.5, height: likedMembers.length * 50 + 170 },
            }}>
            <FlatList
                data={members}
                renderItem={({ item }) => (likedMembers.findIndex((v) => v === item.uid) ? _renderRow(item) : null)}
                keyExtractor={(item) => item.uid}
                showsHorizontalScrollIndicator={false}
                style={styles.flatList}
            />
        </RBSheet>
    );
};

export default LikedMembersDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 300,
        paddingHorizontal: 20,
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
    username: {
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: 'normal',
        fontSize: 13,
        color: colors.GREY_2,
        marginTop: 3,
    },
    renderItem: {
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    userInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 20,
    },
    flatList: {
        flex: 1,
        width: '100%',
        marginTop: 20,
    },
});
