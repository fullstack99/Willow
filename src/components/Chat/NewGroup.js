import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/dist/FontAwesome';

import { colors, fonts } from '../../constants';
import NewGroupSvg from '../../assets/Images/new_group.svg';

const NewGroup = ({ onPress, title, navigation, containerStyle }) => {
    return (
        <TouchableOpacity style={[styles.container, containerStyle]} onPress={onPress}>
            <View style={styles.textWrapper}>
                <NewGroupSvg />
                <Text style={styles.text}>{title}</Text>
            </View>
            <Icon name="angle-right" color={colors.PRIMARY_COLOR} size={25} style={styles.icon} />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderRadius: 25,
        height: 50,
        backgroundColor: colors.WHITE,
        width: '100%',
    },
    textWrapper: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    text: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.BLACK,
        marginLeft: 15,
    },
});
export default NewGroup;
