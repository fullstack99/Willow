import React from 'react';
import { StyleSheet, Text, View, Image, Dimensions } from 'react-native';
import PropTypes from 'prop-types';
import { colors, fonts } from '../../constants';
import * as USER_CONSTANTS from '../../constants/User';
import AboutMeBar from './AboutMeBar';
import BackgroundOne from '../../assets/Images/Profile/background1.png';
import BackgroundTwo from '../../assets/Images/Profile/background2.png';

const { width } = Dimensions.get('window');

const UserInfo = ({ navigation, myself, user }) => {
    if (!user || !user.uid || !user[USER_CONSTANTS.USERNAME] || !user[USER_CONSTANTS.NAME]) return null;

    return (
        <React.Fragment>
            <Image source={BackgroundOne} style={styles.backgroundOne} />
            <Image source={BackgroundTwo} style={styles.backgroundTwo} />

            <View style={styles.userInfoContainer}>
                <Text style={styles.fullname} numberOfLines={1} ellipsizeMode={'tail'}>
                    {user[USER_CONSTANTS.NAME]}
                </Text>
                <Text style={styles.username} numberOfLines={1} ellipsizeMode={'tail'}>
                    {user[USER_CONSTANTS.USERNAME]}
                </Text>
                <AboutMeBar user={user} navigation={navigation} myself={myself} />
            </View>
        </React.Fragment>
    );
};

UserInfo.defaultProps = {
    myself: false,
};

UserInfo.propTypes = {
    navigation: PropTypes.object.isRequired,
    myself: PropTypes.bool.isRequired,
    user: PropTypes.object.isRequired,
};

export default UserInfo;

const styles = StyleSheet.create({
    backgroundOne: {
        height: 200,
        width: 100,
        position: 'absolute',
        left: width * 0.5 - 100,
    },
    backgroundTwo: {
        height: 120,
        position: 'absolute',
        right: 0,
        top: 100,
    },
    userInfoContainer: {
        alignItems: 'center',
        marginTop: 20,
    },
    fullname: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
    },
    username: {
        paddingTop: 5,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: '#9d9d9d',
    },
});
