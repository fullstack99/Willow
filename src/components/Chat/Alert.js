import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

import { colors, fonts } from '../../constants';
import CloseSvg from '../../assets/Images/close_white.svg';

const CustomAlert = ({ message, onPress, visible }) => {
    return (
        <>
            {visible && (
                <View style={styles.container}>
                    <View style={styles.view}>
                        <Text style={styles.text}>{message}</Text>
                        <TouchableOpacity onPress={onPress} style={styles.icon}>
                            <CloseSvg />
                        </TouchableOpacity>
                    </View>
                </View>
            )}
        </>
    );
};

export default CustomAlert;

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        position: 'absolute',
        top: 100,
        width: '100%',
        zIndex: 99,
    },
    view: {
        width: '80%',
        backgroundColor: colors.PRIMARY_COLOR,
        height: 50,
        borderRadius: 25,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    text: {
        fontSize: 13,
        fontFamily: fonts.MULISH_REGULAR,
        color: colors.WHITE,
    },
    icon: {
        position: 'absolute',
        right: 20,
    },
});
