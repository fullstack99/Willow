import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import PropTypes from 'prop-types';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../Button';
import { fonts, emoji } from '../../constants';
import { SIGNUP, LOGIN, PROFILE } from '../../navigator/constants';

const AuthDialog = ({ authDialogRef, navigation }) => {
    const onLoginPress = () => {
        authDialogRef.current.close && authDialogRef.current.close();
        navigation.navigate(PROFILE, { screen: LOGIN, initial: false });
    };
    const onSignUpPress = () => {
        authDialogRef.current.close && authDialogRef.current.close();
        navigation.navigate(PROFILE, { screen: SIGNUP, initial: false });
    };

    return (
        <RBSheet
            ref={authDialogRef}
            height={300}
            animationType={'slide'}
            closeOnDragDown={true}
            openDuration={250}
            customStyles={{
                container: styles.dialogContainer,
            }}>
            <View style={styles.dialog}>
                <Text
                    style={
                        styles.dialogTitle
                    }>{`sorry, to complete this action\n you need to log in or sign up ${emoji.wink}`}</Text>
                <Button onPress={onLoginPress}>login</Button>
                <TouchableOpacity onPress={onSignUpPress}>
                    <Text style={styles.signup}>sign up</Text>
                </TouchableOpacity>
            </View>
        </RBSheet>
    );
};

AuthDialog.propTypes = {
    authDialogRef: PropTypes.object.isRequired,
    navigation: PropTypes.object.isRequired,
};

export default AuthDialog;

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
    },
    dialogTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        marginVertical: 10,
        textAlign: 'center',
    },
    signup: {
        color: '#6AC3C1',
        fontSize: 16,
    },
});
