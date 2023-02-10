import React from 'react';
import { StyleSheet, Platform, View } from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import { fonts, colors } from '../../constants';
import ArrowDown from '../../assets/Images/arrow_down.svg';

const DropDownPicker = ({ onSelect, items, placeholder, pickerStyle }) => {
    return (
        <View style={[styles.container, pickerStyle]}>
            <RNPickerSelect
                placeholder={{
                    label: placeholder,
                    value: null,
                }}
                onValueChange={(val) => {
                    if (Platform.OS === 'web') {
                        onSelect(val.value);
                    } else {
                        onSelect(val);
                    }
                }}
                items={items}
                style={{
                    ...pickerSelectStyles,
                    iconContainer: {
                        top: 20,
                        right: 10,
                    },
                    ...pickerStyle,
                }}
                useNativeAndroidPickerStyle={false}
                Icon={() => {
                    return <ArrowDown />;
                }}
            />
        </View>
    );
};

export default DropDownPicker;

const styles = StyleSheet.create({
    container: {
        width: '100%',
    },
});

const pickerSelectStyles = StyleSheet.create({
    inputIOS: {
        fontSize: 15,
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: '600',
        paddingVertical: 12,
        paddingHorizontal: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.GREY_4,
        borderRadius: 4,
        color: colors.BLACK,
        paddingRight: 30,
        width: '100%',
    },
    inputAndroid: {
        fontSize: 16,
        paddingHorizontal: 10,
        paddingVertical: 8,
        borderBottomWidth: 0.5,
        borderBottomColor: colors.GREY_4,
        borderRadius: 8,
        color: colors.BLACK,
        paddingRight: 30,
    },
});
