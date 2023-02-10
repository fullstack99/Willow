import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import RBSheet from 'react-native-raw-bottom-sheet';
import FastImage from 'react-native-fast-image';

import { fonts, colors } from '../../constants';
import Button from '../../components/Button';
import CheckBoxSvg from '../../assets/Images/check_box.svg';

const PhoneDialog = ({ onClose, onDone, filterRef, user, onSelectPhone }) => {
    const [phones, setPhones] = useState([]);
    const [selectedPhones, setSelectedPhones] = useState([]);
    const [refresh, setRefresh] = useState(false);

    useEffect(() => {
        const temp = [];
        user && user.telephone && temp.push(user.telephone);
        user && user.mobile && temp.push(user.mobile);
        user && user.home && temp.push(user.home);
        setPhones(temp);
    }, [user]);

    const togglePhone = (phone) => {
        const index = selectedPhones.findIndex((v) => v === phone);
        if (index > -1) {
            selectedPhones.splice(index, 1);
        } else {
            selectedPhones.push(phone);
        }
        setSelectedPhones(selectedPhones);
        setRefresh(!refresh);
    };

    const handleSave = () => onSelectPhone(selectedPhones);

    const _renderItem = (item) => {
        return (
            <TouchableOpacity style={styles.phoneContainer} onPress={() => togglePhone(item)}>
                <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                    {item}
                </Text>
                {selectedPhones.findIndex((v) => v === item) > -1 && <CheckBoxSvg />}
            </TouchableOpacity>
        );
    };

    const _renderUser = () => {
        if (!user) return null;
        return (
            <View style={styles.user}>
                <FastImage style={styles.avatar} source={{ uri: user.avatar }} />
                <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
                    {user.name}
                </Text>
            </View>
        );
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
            {_renderUser()}
            <FlatList
                data={phones}
                renderItem={({ item }) => _renderItem(item)}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                style={styles.list}
                ListHeaderComponent={phones.length > 0 ? null : <ActivityIndicator />}
            />
            <Button onPress={handleSave} disabled={phones.length < 1}>
                Save
            </Button>
        </RBSheet>
    );
};

export default PhoneDialog;

const styles = StyleSheet.create({
    dialogContainer: {
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        height: 500,
        paddingHorizontal: 20,
    },
    phoneContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 50,
    },
    text: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        fontWeight: '600',
        color: colors.BLACK,
        width: '70%',
    },
    list: {
        flex: 1,
        width: '100%',
        paddingVertical: 30,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 15,
    },
    user: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        marginTop: 30,
    },
});
