import React, { Component } from 'react';
import {
    StyleSheet,
    View,
    SafeAreaView,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
    Linking,
    Image,
    Text,
    Keyboard,
} from 'react-native';
import { connect } from 'react-redux';
import { TextInput } from 'react-native-paper';
import firestore from '@react-native-firebase/firestore';
import { updateFullname, updateUsername, resetRegister } from '../../actions/registerActions';
import { colors, fonts } from '../../constants';
import { validateUsername } from '../../utility';
import SignUpImage from '../../assets/Images/signup.png';
import Toast from '../../components/Toast';
import Button from '../../components/Button';
import { SIGNUP_II } from '../../navigator/constants';
class SignupI extends Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            usernameError: '',
            show: false,
            toastValue: '',
            existedUserName: [],
            available: false,
        };
    }

    componentDidMount() {
        firestore()
            .collection('USER')
            .get()
            .then((querySnapshot) => {
                const usernames = [];
                querySnapshot.forEach((documentSnapshot) => {
                    documentSnapshot.data().username && usernames.push(documentSnapshot.data().username);
                });
                this.setState({
                    ...this.state,
                    existedUserName: this.state.existedUserName.concat(usernames),
                });
            })
            .catch((error) => {
                console.log(error);
                this.setState({ ...this.state, error: 'Failed to fetch usernames from Firebase.' });
            });
    }

    componentWillUnmount() {
        this.props.resetRegister();
    }

    usernameOnFocus = () => {
        if (this.state.usernameError !== '') this.setState({ ...this.state, usernameError: '' });
        if (this.props.username === '') this.props.updateUsername('@');
    };

    usernameOnBlur = () => {
        if (this.props.username.length !== 0 && !this.props.username.startsWith('@'))
            this.props.updateUsername(`@${this.props.username}`);
        if (this.props.username.length === 1 && this.props.username.startsWith('@')) this.props.updateUsername('');
    };

    checkValidation = () => {
        Keyboard.dismiss();

        if (!this.props.username.startsWith('@')) {
            if (validateUsername(`@${this.props.username}`)) {
                this.props.updateUsername(`@${this.props.username}`);
                this.props.navigation.navigate(SIGNUP_II);
            } else
                this.setState({ ...this.state, usernameError: 'only lowercase letters, numbers and/or underscores are allowed' });
        } else if (this.state.existedUserName.includes(this.props.username))
            this.setState({ ...this.state, usernameError: 'username is already taken' });
        else if (!validateUsername(this.props.username))
            this.setState({ ...this.state, usernameError: 'only lowercase letters, numbers and underscores are allowed' });
        else this.setState({ ...this.state, usernameError: '' }, () => this.props.navigation.navigate(SIGNUP_II));
    };

    render() {
        return (
            <React.Fragment>
                <View style={{ alignItems: 'center', zIndex: 200 }}>
                    <Toast
                        error={this.state.error || this.state.usernameError}
                        close={() => this.setState({ ...this.state, error: '', usernameError: '' })}
                    />
                </View>
                <SafeAreaView style={styles.container}>
                    <TouchableWithoutFeedback style={styles.container} onPress={Keyboard.dismiss}>
                        <KeyboardAvoidingView style={styles.container} behavior={'position'} keyboardVerticalOffset={80}>
                            <View style={styles.imageContainer}>
                                <Image source={SignUpImage} style={styles.image} resizeMode="contain" />
                            </View>
                            <View style={styles.inputContainer}>
                                <TextInput
                                    autoCapitalize="words"
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    label="full name"
                                    value={this.props.fullName}
                                    onChangeText={this.props.updateFullname}
                                    style={styles.input}
                                    theme={{
                                        colors: {
                                            placeholder: '#a2a2a2',
                                            text: colors.BLACK,
                                            primary: this.props.fullName.length < 1 === '' ? 'red' : '#a2a2a2',
                                            underlineColor: 'transparent',
                                            backgroundColor: 'transparent',
                                            fontFamily: fonts.MULISH_SEMI_BOLD,
                                            fontSize: 15,
                                        },
                                    }}
                                />
                                <TextInput
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                    returnKeyType="done"
                                    label="username"
                                    value={this.props.username}
                                    onChangeText={this.props.updateUsername}
                                    onFocus={this.usernameOnFocus}
                                    onBlur={this.usernameOnBlur}
                                    style={styles.input}
                                    underlineColor={this.state.usernameError !== '' ? 'red' : '#a2a2a2'}
                                    theme={{
                                        colors: {
                                            placeholder: this.state.usernameError !== '' ? 'red' : '#a2a2a2',
                                            text: colors.BLACK,
                                            primary: this.state.usernameError !== '' ? 'red' : '#a2a2a2',
                                            underlineColor: 'transparent',
                                            backgroundColor: 'transparent',
                                            fontFamily: fonts.MULISH_SEMI_BOLD,
                                            fontSize: 15,
                                        },
                                    }}
                                />
                            </View>
                            <View style={styles.nextButtonContainer}>
                                <Text style={styles.hintMessage}>
                                    by continuing, you agree to our{' '}
                                    <Text style={styles.term} onPress={() => Linking.openURL('https://www.willow.app/terms')}>
                                        terms
                                    </Text>{' '}
                                    and{' '}
                                    <Text style={styles.term} onPress={() => Linking.openURL('https://www.willow.app/privacy')}>
                                        privacy policy
                                    </Text>
                                </Text>
                                <Button
                                    height={80}
                                    disabled={this.props.username.length < 2 || this.props.fullName.length === 0}
                                    onPress={this.checkValidation}>
                                    next
                                </Button>
                            </View>
                        </KeyboardAvoidingView>
                    </TouchableWithoutFeedback>
                </SafeAreaView>
            </React.Fragment>
        );
    }
}

const mapStateToProps = (state) => ({
    fullName: state.register.fullName,
    username: state.register.username,
});

const mapDispatchToProps = {
    updateUsername,
    updateFullname,
    resetRegister,
};

export default connect(mapStateToProps, mapDispatchToProps)(SignupI);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    imageContainer: {
        height: '35%',
        alignItems: 'center',
        marginHorizontal: 50,
    },
    image: {
        width: '100%',
        height: '100%',
    },
    inputContainer: {
        height: '45%',
        marginHorizontal: 25,
    },
    input: {
        marginVertical: 30,
        backgroundColor: 'transparent',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 20,
    },
    nextButtonContainer: {
        height: '20%',
        justifyContent: 'flex-end',
    },
    hintMessage: {
        color: colors.DARKER_GREY,
        fontFamily: fonts.MULISH_ITALIC,
        fontSize: 15,
        marginHorizontal: 50,
        textAlign: 'center',
    },
    term: {
        color: colors.BLACK,
        fontFamily: fonts.MULISH_BOLD_ITALIC,
        fontSize: 15,
    },
});
