import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { PickerIOS } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStyles from '../../constants/globalStyles';
import { fonts } from '../../constants';
const { height, width } = Dimensions.get('window');

const StatusDialog = ({ statusDialogRef, filterDialogRef, status, setStatus }) => {
    const insets = useSafeAreaInsets();
    const options = [
        { label: 'choose', value: null },
        { label: 'planning', value: 'planning' },
        { label: 'expecting', value: 'expecting' },
        { label: 'parent', value: 'parent' },
    ];

    return (
        <RBSheet
            ref={statusDialogRef}
            height={height * 0.35}
            animationType={'slide'}
            dragFromTopOnly={false}
            closeOnPressMask
            onClose={() => {
                setTimeout(() => filterDialogRef.current && filterDialogRef.current.open(), 500);
            }}
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <View style={[GlobalStyles.alignCenterContainer, { marginBottom: insets.bottom + 20 }]}>
                <Text style={styles.title}>choose status</Text>
                <PickerIOS selectedValue={status} onValueChange={(itemValue) => setStatus(itemValue)} style={styles.pickerStyle}>
                    {options.map((o) => (
                        <PickerIOS.Item key={o.label} label={o.label} value={o.value} />
                    ))}
                </PickerIOS>
            </View>
        </RBSheet>
    );
};

export default StatusDialog;

const styles = StyleSheet.create({
    title: {
        fontSize: 18,
        textAlign: 'center',
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        marginVertical: 20,
    },
    pickerStyle: {
        height: height * 0.3,
        width,
    },
});
