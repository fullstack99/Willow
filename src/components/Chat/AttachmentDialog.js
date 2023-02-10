import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { fonts, colors } from '../../constants';
import PollSvg from '../../assets/Images/poll.svg';
import PhotoSvg from '../../assets/Images/photo.svg';

const AttachmentDialog = ({ handleMedia, handlePoll, attachmentRef }) => {
    return (
        <RBSheet
            ref={attachmentRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <TouchableOpacity onPress={handleMedia} style={styles.item}>
                <PhotoSvg />
                <Text style={styles.text}>photo or video</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handlePoll} style={styles.item}>
                <PollSvg />
                <Text style={styles.text}>poll</Text>
            </TouchableOpacity>
        </RBSheet>
    );
};

export default AttachmentDialog;

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
