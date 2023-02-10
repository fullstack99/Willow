import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { fonts, colors } from '../../constants';
import BlockSvg from '../../assets/Images/blocklist.svg';
import DeleteSvg from '../../assets/Images/delete_black.svg';

const PollDialog = ({ handleDeletePoll, handleClosePoll, pollDialogRef, selectedMessage }) => {
    return (
        <RBSheet
            ref={pollDialogRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <TouchableOpacity onPress={handleDeletePoll} style={styles.item}>
                <DeleteSvg />
                <Text style={styles.text}>delete poll</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleClosePoll} style={styles.item}>
                <BlockSvg />
                <Text style={styles.text}>{selectedMessage?.isPollHided ? 'reopen poll' : 'close poll'} </Text>
            </TouchableOpacity>
        </RBSheet>
    );
};

export default PollDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 250,
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
        marginTop: 30,
        flexDirection: 'row',
        alignItems: 'center',
    },
});
