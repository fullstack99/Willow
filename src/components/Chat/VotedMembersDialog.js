import React from 'react';
import { View, Text, StyleSheet, FlatList, Dimensions } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';

import { fonts, colors } from '../../constants';
import CheckBoxSvg from '../../assets/Images/check-small.svg';
const { height } = Dimensions.get('screen');

const VotedMembersDialog = ({ votedMembersDialogRef, members, votedMembers, selectedType }) => {
    const _renderRow = (item) => {
        if (selectedType === 'all') {
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
                    {votedMembers && votedMembers.findIndex((v) => v === item.uid) > -1 ? <CheckBoxSvg /> : null}
                </View>
            );
        } else {
            return (
                <>
                    {votedMembers && votedMembers.findIndex((v) => v === item.uid) > -1 ? (
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
                    ) : null}
                </>
            );
        }
    };

    return (
        <RBSheet
            ref={votedMembersDialogRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: {
                    ...styles.dialogContainer,
                    maxHeight: height * 0.5,
                    height: selectedType === 'all' ? members.length * 50 + 170 : votedMembers?.length * 50 + 170,
                },
            }}>
            <FlatList
                data={members}
                renderItem={({ item }) => _renderRow(item)}
                keyExtractor={(item) => item.uid}
                showsHorizontalScrollIndicator={false}
                style={styles.flatList}
            />
        </RBSheet>
    );
};

export default VotedMembersDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 330,
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
