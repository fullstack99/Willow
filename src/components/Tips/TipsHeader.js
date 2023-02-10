import React from 'react';
import { StyleSheet, SafeAreaView, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import LeftArrowIcon from '../../assets/Images/left-arrow-black.svg';
import SettingsIcon from '../../assets/Images/settings-black.svg';

const TipsHeader = ({ height, iconSize, onPress, settingOnPress }) => {
    return (
        <SafeAreaView style={[styles.container, { height }]}>
            <TouchableOpacity onPress={onPress}>
                <LeftArrowIcon width={iconSize} height={iconSize} />
            </TouchableOpacity>

            {settingOnPress && (
                <TouchableOpacity style={styles.rightIcon} onPress={settingOnPress}>
                    <SettingsIcon width={iconSize} height={iconSize} />
                </TouchableOpacity>
            )}
        </SafeAreaView>
    );
};

TipsHeader.defaultProps = {
    height: 90,
    iconSize: 20,
    onPress: () => {},
};

TipsHeader.propTypes = {
    height: PropTypes.number.isRequired,
    iconSize: PropTypes.number.isRequired,
    onPress: PropTypes.func.isRequired,
    settingOnPress: PropTypes.func,
};

export default TipsHeader;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
    },
    rightContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    rightIcon: {
        paddingLeft: 20,
    },
});
