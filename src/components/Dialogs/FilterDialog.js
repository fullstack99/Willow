import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TouchableWithoutFeedback, Keyboard, Dimensions } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { fonts, colors } from '../../constants';
import Button from '../Button';

const theme = {
    colors: {
        placeholder: colors.DARK_GREY,
        text: colors.BLACK,
        primary: colors.DARK_GREY,
        underlineColor: 'transparent',
        backgroundColor: 'transparent',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
    },
};

const FilterDialog = ({
    applyFilter,
    resetFilter,
    filterDialogRef,
    statusDialogRef,
    status,
    city,
    setCity,
    children,
    setChildren,
    selectedType,
    setSelectedType,
}) => {
    const insets = useSafeAreaInsets();

    const types = [
        { label: 'new born', key: 'newborn' },
        { label: 'infant', key: 'infant' },
        { label: 'toddler', key: 'toddler' },
        { label: 'child', key: 'child' },
        { label: 'tween', key: 'tween' },
        { label: 'teen', key: 'teen' },
        { label: 'adult', key: 'adult' },
    ];

    const openStatusDialog = () => {
        filterDialogRef.current && filterDialogRef.current.state.modalVisible && filterDialogRef.current.close();
        setTimeout(() => statusDialogRef.current && statusDialogRef.current.open(), 500);
    };

    const handleSelectType = (type) => {
        if (selectedType.indexOf(type) !== -1) {
            setSelectedType(selectedType.filter((t) => t !== type));
        } else {
            setSelectedType([...selectedType, type]);
        }
    };

    const isDisabled = () => {
        return Boolean(!city) && Boolean(!status) && typeof children === 'string' && selectedType.length === 0;
    };

    return (
        <RBSheet
            ref={filterDialogRef}
            height={Dimensions.get('window').height * 0.85}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={[styles.dialog, { marginBottom: insets.bottom }]}>
                    <Text style={styles.dialogTitle}>filter</Text>
                    <TextInput
                        autoCapitalize="words"
                        returnKeyType="done"
                        label="city"
                        value={city}
                        onChangeText={(text) => setCity(text)}
                        style={styles.input}
                        theme={theme}
                    />
                    <TextInput
                        label="status"
                        value={status}
                        editable={false}
                        showSoftInputOnFocus={false}
                        onTouchStart={openStatusDialog}
                        style={styles.input}
                        theme={theme}
                    />
                    <TextInput
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                        label="amount of children"
                        value={children.toString()}
                        onChangeText={(text) => (text ? setChildren(parseInt(text)) : setChildren(''))}
                        style={styles.input}
                        theme={theme}
                    />
                    <View style={styles.typeView}>
                        {types.map((v) => (
                            <TouchableOpacity onPress={() => handleSelectType(v.key)} key={v.key}>
                                <View
                                    style={[
                                        styles.item,
                                        selectedType.indexOf(v.key) !== -1 ? styles.selectedTypeItem : styles.typeItem,
                                    ]}>
                                    <Text style={selectedType.indexOf(v.key) !== -1 ? styles.selectedType : styles.type}>
                                        {v.label}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Button onPress={applyFilter} height={50} disabled={isDisabled()}>
                        apply
                    </Button>
                    <TouchableOpacity style={{ marginBottom: 20 }} onPress={resetFilter}>
                        <Text style={styles.reset}>reset</Text>
                    </TouchableOpacity>
                </View>
            </TouchableWithoutFeedback>
        </RBSheet>
    );
};

export default FilterDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        justifyContent: 'center',
        alignItems: 'center',
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
    },
    dialog: {
        flex: 1,
        justifyContent: 'flex-start',
        alignItems: 'center',
        width: '100%',
        paddingHorizontal: 20,
    },
    dialogTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        marginVertical: 20,
        textAlign: 'center',
    },
    picker: {
        marginBottom: 30,
    },
    typeView: {
        flex: 1,
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        marginTop: 10,
    },
    item: {
        alignItems: 'center',
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        marginRight: 10,
        marginBottom: 15,
        borderRadius: 25,
    },
    selectedTypeItem: {
        backgroundColor: colors.PRIMARY_COLOR,
    },
    typeItem: {
        backgroundColor: colors.WHITE_2,
    },
    type: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
        color: colors.BLACK,
    },
    selectedType: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
        color: colors.WHITE,
    },

    input: {
        width: '100%',
        paddingHorizontal: 10,
        backgroundColor: colors.WHITE,
        backgroundColor: 'transparent',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 20,
        marginBottom: 15,
    },
    reset: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
        color: 'red',
    },
});
