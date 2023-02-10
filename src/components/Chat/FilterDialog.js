import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';

import { fonts, colors } from '../../constants';
import DropDownPicker from '../../components/Chat/DropDownPicker';
import Button from '../../components/Button';

const FilterDialog = ({ onClose, onDone, filterRef }) => {
    const [city, setCity] = useState();
    const [status, setStatus] = useState();
    const [child, setChildren] = useState();
    const [selectedType, setSelectedType] = useState({});

    const statuses = [
        { label: 'Planning', value: 'planning' },
        { label: 'Experting', value: 'experting' },
        { label: 'Parent', value: 'Parent' },
    ];
    const types = [
        { label: 'New born', value: 'new_bron' },
        { label: 'Baby', value: 'baby' },
        { label: 'Child', value: 'child' },
        { label: 'Teenager', value: 'teenager' },
    ];

    useEffect(() => {
        console.log(city, status, child, selectedType);
    }, [city, status, child, selectedType]);

    const handleStatus = (status) => setStatus(status);

    const handleSelectType = (type) => setSelectedType(type);

    const isDisabled = () => {
        if (city && status && child && selectedType) return false;
        return true;
    };

    return (
        <RBSheet
            ref={filterRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <ScrollView>
                <View style={styles.dialog}>
                    <Text style={styles.dialogTitle}>Filter</Text>
                    <TextInput
                        placeholder="City"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="done"
                        label="username"
                        value={city}
                        onChangeText={(text) => setCity(text)}
                        style={styles.input}
                    />
                    <DropDownPicker items={statuses} placeholder="Status" onSelect={handleStatus} pickerStyle={styles.picker} />
                    <TextInput
                        placeholder="Amount of Child"
                        placeholderTextColor="#999"
                        autoCapitalize="none"
                        autoCorrect={false}
                        keyboardType="numeric"
                        label="Child"
                        value={child}
                        onChangeText={(text) => setChildren(text)}
                        style={styles.input}
                    />
                    <View style={styles.typeView}>
                        {types.map((v) => (
                            <TouchableOpacity onPress={() => handleSelectType(v)} key={v.value}>
                                <View
                                    style={[
                                        styles.item,
                                        v.value === selectedType.value ? styles.selectedTypeItem : styles.typeItem,
                                    ]}>
                                    <Text style={[v.value === selectedType.value ? styles.selectedType : styles.type]}>
                                        {v.label}
                                    </Text>
                                </View>
                            </TouchableOpacity>
                        ))}
                    </View>
                    <Button onPress={onClose} height={60} disabled={isDisabled}>
                        Search
                    </Button>
                </View>
            </ScrollView>
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
        height: '70%',
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
        marginVertical: 30,
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
        marginVertical: 30,
        fontSize: 15,
        fontFamily: fonts.MULISH_REGULAR,
        fontWeight: '600',
        borderBottomWidth: 1,
        borderBottomColor: colors.GREY_4,
        width: '100%',
        paddingHorizontal: 10,
    },
});
