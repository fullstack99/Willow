import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { StyleSheet, TouchableOpacity, Text, View, Switch } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { fonts, colors } from '../../constants';
import DeleteSvg from '../../assets/Images/delete-forum.svg';
import PrivacySvg from '../../assets/Images/privacy.svg';
import ShareSvg from '../../assets/Images/share_2.svg';

const ShareDialog = ({ onShare, onDelete, shareRef, permission, onReport, handleAdminApprove }) => {
    const { currentGroup } = useSelector((state) => state.chats);

    return (
        <RBSheet
            ref={shareRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <View style={styles.textContainer}>
                {permission === 'admin' ? (
                    <>
                        <View style={styles.item}>
                            <PrivacySvg />
                            <Text style={styles.text}>admin approval to join</Text>
                        </View>
                        <Switch
                            trackColor={{ false: colors.GREY_2, true: colors.PRIMARY_COLOR }}
                            thumbColor={colors.WHITE_2}
                            ios_backgroundColor={colors.GREY_2}
                            onValueChange={handleAdminApprove}
                            value={currentGroup.adminApprove}
                        />
                    </>
                ) : currentGroup.adminApprove ? (
                    <View style={styles.item}>
                        <PrivacySvg />
                        <Text style={styles.text}>admin approval to join is ON</Text>
                    </View>
                ) : (
                    <View style={styles.item}>
                        <PrivacySvg />
                        <Text style={styles.text}>admin approval to join is OFF</Text>
                    </View>
                )}
            </View>
            <TouchableOpacity onPress={onShare} style={styles.item}>
                <ShareSvg />
                <Text style={styles.text}>share link</Text>
            </TouchableOpacity>
            {permission === 'admin' ? (
                <TouchableOpacity onPress={onDelete} style={[styles.item, { marginTop: 20 }]}>
                    <DeleteSvg />
                    <Text style={styles.deleteText}>delete forum</Text>
                </TouchableOpacity>
            ) : (
                <TouchableOpacity onPress={onReport} style={[styles.item, { marginTop: 20 }]}>
                    <DeleteSvg />
                    <Text style={styles.deleteText}>report forum</Text>
                </TouchableOpacity>
            )}
        </RBSheet>
    );
};

export default ShareDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 300,
        paddingHorizontal: 20,
    },
    text: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        fontWeight: '600',
        color: colors.DARK_GREY,
        textAlign: 'center',
        marginLeft: 10,
    },
    deleteText: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        fontWeight: '600',
        color: colors.RED_2,
        textAlign: 'center',
        marginLeft: 10,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginVertical: 20,
    },
});
