import React from 'react';
import { StyleSheet, TouchableOpacity, Text, View } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { fonts, colors } from '../../constants';
import Button from '../../components/Button';

const DeletePrivateGroupDialog = ({ onClose, onDelete, forwardRef }) => {
    return (
        <RBSheet
            ref={forwardRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <View style={styles.titleView}>
                <Text style={styles.title}>Are you sure you want to delete this chat?</Text>
            </View>
            <Button onPress={onClose} height={60}>
                No
            </Button>
            <TouchableOpacity onPress={onDelete} style={styles.leaveBtn}>
                <Text style={styles.text}>Yes</Text>
            </TouchableOpacity>
        </RBSheet>
    );
};

export default DeletePrivateGroupDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 350,
        paddingHorizontal: 20,
    },
    titleView: {
        paddingHorizontal: 27,
        marginVertical: 30,
    },
    title: {
        textAlign: 'center',
        fontFamily: fonts.NEWYORKEXTRALARGE_BLACK,
        fontSize: 18,
        fontWeight: '500',
        color: colors.BLACK,
    },
    text: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        fontWeight: '600',
        color: colors.RED_2,
        textAlign: 'center',
    },
    leaveBtn: {
        marginTop: 30,
    },
});
