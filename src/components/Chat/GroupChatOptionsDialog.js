import React from 'react';
import { View, StyleSheet, TouchableOpacity, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { NEW_POLL } from '../../navigator/constants';
import { fonts, colors } from '../../constants';

import CreatePollIcon from '../../assets/Images/Chat/create-poll-icon.svg';

const GroupChatOptionsDialog = ({ forwardRef, navigation, room }) => {
    const _onCreatePollPress = () => {
        forwardRef.current && forwardRef.current.close();
        setTimeout(() => navigation && navigation.push(NEW_POLL, { room }), 250);
    };

    return (
        <RBSheet
            ref={forwardRef}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <TouchableOpacity onPress={_onCreatePollPress} style={styles.item}>
                <View style={styles.svg}>
                    <CreatePollIcon />
                </View>
                <Text style={styles.text}>create poll</Text>
            </TouchableOpacity>
        </RBSheet>
    );
};

export default GroupChatOptionsDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 200,
        paddingHorizontal: 20,
    },
    text: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        fontWeight: '600',
        color: colors.BLACK,
        marginLeft: 15,
    },
    item: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    svg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: colors.WHITE_2,
    },
});
