import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../constants';

const ContentHeader = ({ item, onPress, from, selectedTab }) => {
    return (
        <TouchableOpacity style={styles.container} onPress={() => onPress && onPress(item)}>
            <View style={item.key === selectedTab ? styles.selectedItem : styles.item}>
                {item.key === selectedTab ? item.selectedIcon : item.icon}
                <Text style={item.key === selectedTab ? styles.selectedTitle : styles.title}>{item.title}</Text>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 10,
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        height: 45,
    },
    selectedItem: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.PRIMARY_COLOR,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 25,
    },
    item: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.WHITE_2,
        paddingHorizontal: 20,
        paddingVertical: 14,
        borderRadius: 25,
    },
    selectedTitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
        fontWeight: '600',
        color: colors.WHITE,
        marginLeft: 9,
    },
    title: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 16,
        fontWeight: '600',
        color: colors.BLACK,
        marginLeft: 9,
    },
});
export default ContentHeader;
