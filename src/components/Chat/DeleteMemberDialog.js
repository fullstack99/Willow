import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { fonts, colors } from '../../constants';
import Button from '../Button';

const DeleteMemberDialog = ({ onClose, onDone, onDelete, deleteRef }) => {
    return (
        <RBSheet
            ref={deleteRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <Button onPress={onDelete} height={60} style={{ backgroundColor: colors.RED_2 }}>
                Delete members
            </Button>
            <TouchableOpacity onPress={onClose} style={styles.leaveBtn}>
                <Text style={styles.text}>Back</Text>
            </TouchableOpacity>
        </RBSheet>
    );
};

export default DeleteMemberDialog;

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
        fontWeight: 'bold',
        color: colors.GREY_6,
        textAlign: 'center',
    },
    leaveBtn: {
        marginTop: 30,
    },
});
