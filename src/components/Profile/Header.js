import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import auth from '@react-native-firebase/auth';
import SettingsIcon from '../../assets/Images/Profile/settings.svg';
import AddUserIcon from '../../assets/Images/Profile/add_user.svg';
import FontAwesomeIcon from 'react-native-vector-icons/dist/FontAwesome';

const Header = ({ navigation, myself, addUserOnPress, settingsOnPress }) => {
    if (myself) {
        return (
            <View style={styles.header}>
                <View style={{ flexDirection: 'row' }}>
                    <TouchableOpacity onPress={addUserOnPress}>
                        <AddUserIcon width={30} height={30} />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={settingsOnPress}>
                    <SettingsIcon width={30} height={20} />
                </TouchableOpacity>
            </View>
        );
    } else {
        return (
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <FontAwesomeIcon name="angle-left" size={30} />
                </TouchableOpacity>
                {auth().currentUser && (
                    <TouchableOpacity onPress={settingsOnPress}>
                        <SettingsIcon width={30} height={20} />
                    </TouchableOpacity>
                )}
            </View>
        );
    }
};

Header.defaultProps = {
    myself: false,
    addUserOnPress: () => {},
    settingsOnPress: () => {},
};

Header.propTypes = {
    navigation: PropTypes.object.isRequired,
    myself: PropTypes.bool.isRequired,
    addUserOnPress: PropTypes.func,
    settingsOnPress: PropTypes.func.isRequired,
};

export default Header;

const styles = StyleSheet.create({
    header: {
        position: 'absolute',
        paddingTop: 35,
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
});
