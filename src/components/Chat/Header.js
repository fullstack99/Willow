import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Image, Text, TouchableOpacity } from 'react-native';
import FontAwesome from 'react-native-vector-icons/dist/FontAwesome';

import { colors, fonts } from '../../constants';

const Header = ({ title, subTitle = '', enabledBack, onPress, goBack, icon, where = '', style }) => {
    return (
        <View style={styles.container}>
            {enabledBack && <FontAwesome style={styles.goBack} size={30} name={'angle-left'} onPress={goBack} />}

            {where === 'chatting' ? (
                <View style={styles.labelView}>
                    <Text style={styles.label} numberOfLines={1} ellipsizeMode={'tail'}>
                        {title}
                    </Text>
                    <Text style={styles.subLabel} numberOfLines={1} ellipsizeMode={'tail'}>
                        {subTitle}
                    </Text>
                </View>
            ) : (
                <Text style={[styles.title, style]}>{title}</Text>
            )}

            <TouchableOpacity style={styles.chat} onPress={onPress}>
                {icon}
            </TouchableOpacity>
        </View>
    );
};

Header.propTypes = {
    height: PropTypes.number,
};

Header.defaultProps = {
    height: 50,
};

export default Header;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    goBack: {
        position: 'absolute',
        left: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    chat: {
        position: 'absolute',
        right: 20,
        // width: 20,
        height: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    title: {
        fontFamily: fonts.NEWYORKEXTRALARGE_MEDIUM,
        fontSize: 18,
        color: colors.BLACK,
    },
    labelView: {
        alignSelf: 'center',
        width: '55%',
    },
    label: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.BLACK,
        fontWeight: '600',
        textAlign: 'center',
    },
    subLabel: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
        color: colors.GREY_2,
        textAlign: 'center',
    },
    avatar: {
        height: 40,
        width: 40,
        borderRadius: 20,
    },
});
