import React from 'react';
import { StyleSheet, Text, View, Dimensions } from 'react-native';
import { PickerIOS } from '@react-native-picker/picker';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import RBSheet from 'react-native-raw-bottom-sheet';
import GlobalStyles from '../../constants/globalStyles';
import { fonts } from '../../constants';
const { height, width } = Dimensions.get('window');

const SelectGenderDialog = ({ forwardRef, kid, onGenderChoose }) => {
    if (!forwardRef || !kid) return null;
    const insets = useSafeAreaInsets();
    const options = [
        { label: 'choose', value: null },
        { label: 'male', value: 'male' },
        { label: 'female', value: 'female' },
        { label: 'prefer not to say', value: 'prefer not to say' },
    ];

    return (
        <RBSheet
            ref={forwardRef}
            height={height * 0.35}
            animationType={'slide'}
            dragFromTopOnly
            closeOnPressMask
            openDuration={250}
            customStyles={{
                container: GlobalStyles.dialogContainer,
            }}>
            <View style={[GlobalStyles.alignCenterContainer, { marginBottom: insets.bottom + 20 }]}>
                <Text style={styles.title}>choose gender</Text>
                <PickerIOS
                    selectedValue={kid?.gender}
                    onValueChange={(itemValue) => onGenderChoose(itemValue)}
                    style={styles.pickerStyle}>
                    {options.map((o) => (
                        <PickerIOS.Item key={o.label} label={o.label} value={o.value} />
                    ))}
                </PickerIOS>
            </View>
        </RBSheet>
    );
};

export default SelectGenderDialog;

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
