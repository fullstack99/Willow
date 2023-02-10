import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, ScrollView, View, Text, StatusBar, Image, TouchableOpacity, TextInput } from 'react-native';
import { colors, fonts } from '../../constants';
import auth from '@react-native-firebase/auth';
import CodeInput from 'react-native-confirmation-code-input';
import CountDown from 'react-native-countdown-component';
class ForgotPassword extends Component {
    constructor(props) {
        super(props);
        this.state = {
            otp: '',
            timerEnable: false,
            resendButtonDisable: false,
        };
    }

    componentWillUnmount() {
        this.refs.codeInputRef2.clear();
    }

    static navigationOptions = ({ navigation }) => {
        return {
            headerLeft: (
                <Icon
                    style={{
                        marginLeft: 20,
                        alignItems: 'center',
                    }}
                    size={30}
                    name={'angle-left'}
                    onPress={() => {
                        navigation.goBack();
                    }}
                />
            ),
            headerStyle: { elevation: 0, borderBottomWidth: 0, shadowColor: 'transparent' },
            title: '',
        };
    };

    resendVerificationCode = async () => {
        this.refs.codeInputRef2.clear();
        let phoneNumber = this.props.phone;
        auth()
            .signInWithPhoneNumber(phoneNumber, true)
            .then((res) => {
                console.log('Verification', res);
            });
    };

    render() {
        return (
            <React.Fragment>
                <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
                    <View style={{ flex: 1 }}>
                        <Text
                            style={{
                                fontSize: 18,
                                textAlign: 'center',
                                color: 'black',
                                fontFamily: fonts.NEWYORKLARGE_MEDIUM,
                                marginTop: 10,
                            }}>
                            Forgot Password
                        </Text>

                        <View style={{ alignItems: 'center', justifyContent: 'center', padding: 10 }}>
                            <Text
                                style={{ fontSize: 15, textAlign: 'center', color: '#A2A2A2', fontFamily: fonts.MULISH_REGULAR }}>
                                Code was send to your{'\n'} phone number{' '}
                            </Text>
                        </View>
                        <View style={{ flex: 0.5 }}>
                            <CodeInput
                                ref="codeInputRef2"
                                autoFocus={false}
                                ignoreCase={true}
                                inputPosition="center"
                                keyboardType="numeric"
                                size={50}
                                space={10}
                                codeLength={4}
                                onFulfill={(code) => {
                                    this.setState({ otp: code }, () => {
                                        this.props.navigation.navigate('Home');
                                        this.props.sheet.close();
                                    });
                                }}
                                containerStyle={{}}
                                codeInputStyle={{
                                    fontFamily: fonts.NEUTRA_BOOK,
                                    fontSize: 20,
                                    borderRadius: 10,
                                    backgroundColor: colors.GREY,
                                    color: colors.BLACK,
                                }}
                            />
                        </View>
                        {this.state.timerEnable ? (
                            <TouchableOpacity
                                style={{ paddingTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                                disabled={this.state.timerEnable}
                                onPress={() => this.resendVerificationCode()}>
                                <CountDown
                                    until={30}
                                    onFinish={() => this.setState({ resendButtonDisable: false, timerEnable: false })}
                                    size={13}
                                    digitStyle={{ backgroundColor: colors.white }}
                                    digitTxtStyle={{ color: colors.BLACK, fontFamily: fonts.MULISH_REGULAR }}
                                    timeToShow={['S']}
                                    timeLabels={''}
                                />

                                <Text style={{ color: '#a2a2a2' }}>to resend second </Text>
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity
                                style={{ paddingTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}
                                onPress={() => this.setState({ timerEnable: true })}>
                                <Text style={{ color: '#a2a2a2', fontFamily: fonts.MULISH_REGULAR, fontSize: 13 }}>
                                    Send Another Code{' '}
                                </Text>
                            </TouchableOpacity>
                        )}
                    </View>
                </SafeAreaView>
            </React.Fragment>
        );
    }
}

export default ForgotPassword;
