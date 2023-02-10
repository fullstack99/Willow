import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import { fonts, colors } from '../../constants';

const PrivateContentDialog = ({ forwardRef }) => {
    const insets = useSafeAreaInsets();
    return (
        <RBSheet
            ref={forwardRef}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: { ...styles.dialogContainer, paddingBottom: insets.bottom },
            }}>
            <View style={styles.container}>
                <Text style={styles.title}>private content</Text>
                <Text style={styles.message}>sorry. this was posted privately by the creator and can't be shared.</Text>
            </View>
        </RBSheet>
    );
};

export default PrivateContentDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 200,
        paddingHorizontal: 20,
    },
    container: {
        flex: 1,
        alignItems: 'center',
    },
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        marginBottom: 20,
    },
    message: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        textAlign: 'center',
    },
});
