import React from 'react';
import { StyleSheet, Text } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { fonts, colors } from '../../constants';
import Button from '../Button';

const AudioRecordDialog = ({ handleToggleRecord, audioRecordRef, recording }) => {
    return (
        <RBSheet
            ref={audioRecordRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <Button onPress={handleToggleRecord}>
                {recording ? <Text style={styles.text}>stop</Text> : <Text style={styles.text}>record</Text>}
            </Button>
        </RBSheet>
    );
};

export default AudioRecordDialog;

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
        color: colors.WHITE,
        marginLeft: 15,
    },
});
