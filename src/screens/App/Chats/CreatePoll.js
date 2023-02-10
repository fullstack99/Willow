import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
    View,
    Text,
    TextInput,
    SafeAreaView,
    TouchableOpacity,
    Keyboard,
    FlatList,
    StyleSheet,
    Switch,
    KeyboardAvoidingView,
    TouchableWithoutFeedback,
} from 'react-native';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import * as USER_CONSTANTS from '../../../constants/User';
import Button from '../../../components/Button';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';
import Toast from '../../../components/Toast';
import CloseSvg from '../../../assets/Images/close.svg';
import FirebaseChatMessage from '../../../service/firebase_requests/ChatMessage';
import FirebaseErrors from '../../../service/firebase_errors';

const CreatePoll = ({ navigation, route }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [question, setQuestion] = useState('');
    const [options, setOptions] = useState(new Array({ index: 0, answer: '', votes: [] }, { index: 1, answer: '', votes: [] }));
    const [anonymous, setAnonymous] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const { room } = route.params;

    const toggleSwitch = () => setAnonymous(!anonymous);

    const addOption = () => {
        const temp = [...options, { index: options.length, answer: '', votes: [] }];
        setOptions(temp);
    };

    const removeOption = (index) => {
        const temp = [...options];
        temp.splice(index, 1);
        setOptions(temp);
    };

    const handleChangeText = (index, answer) => {
        const temp = [...options];
        temp[index].answer = answer;
        setOptions(temp);
    };

    const postPoll = async () => {
        setLoading(true);
        const poll_data = {
            roomId: room.id,
            question,
            user: {
                [USER_CONSTANTS.UID]: user[USER_CONSTANTS.UID],
                [USER_CONSTANTS.AVATAR_URL]: user[USER_CONSTANTS.AVATAR_URL],
                [USER_CONSTANTS.NAME]: user[USER_CONSTANTS.NAME],
                [USER_CONSTANTS.USERNAME]: user[USER_CONSTANTS.USERNAME],
            },
            totalVotes: 0,
            anonymous,
        };
        return FirebaseChatMessage.createPoll(room, poll_data, options)
            .then(navigation.goBack)
            .catch((error) => FirebaseErrors.setError(error, setError))
            .finally(() => setLoading(false));
    };

    const disabled = () => {
        return !question || options.length <= 1 || options.filter((o) => !o.answer).length > 0;
    };

    const renderOptionsHeader = () => {
        return (
            <View style={styles.view}>
                <Text style={styles.label}>answer options</Text>
            </View>
        );
    };

    const renderOption = ({ item, index }) => {
        return (
            <View key={index}>
                <TextInput
                    style={styles.input}
                    autoCapitalize={'none'}
                    returnKeyType="done"
                    onChangeText={(answer) => {
                        handleChangeText(index, answer);
                    }}
                    placeholder="option"
                    placeholderTextColor={colors.BLACK_3}
                    autoCorrect
                    value={item.answer}
                />
                {options.length > 1 && (
                    <TouchableOpacity style={styles.closeIcon} onPress={() => removeOption(index)}>
                        <CloseSvg />
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    const renderFooterOptions = () => {
        return (
            <TouchableOpacity style={styles.addOption} onPress={addOption}>
                <Text style={styles.answer}>add option</Text>
            </TouchableOpacity>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                <View style={{ flex: 1 }}>
                    <KeyboardAvoidingView style={styles.container} behavior="padding" keyboardVerticalOffset={120}>
                        <View style={styles.view}>
                            <Text style={styles.label}>your question</Text>
                            <TextInput
                                style={styles.input}
                                autoCapitalize={'none'}
                                returnKeyType="done"
                                onChangeText={(answer) => {
                                    setQuestion(answer);
                                }}
                                placeholder="write a question"
                                placeholderTextColor={colors.BLACK_3}
                                autoCorrect
                                value={question}
                            />
                        </View>
                        <FlatList
                            keyExtractor={(item, index) => index.toString()}
                            data={options}
                            renderItem={renderOption}
                            keyboardShouldPersistTaps={'handled'}
                            showsVerticalScrollIndicator={false}
                            ListHeaderComponent={renderOptionsHeader}
                            ListFooterComponent={renderFooterOptions}
                        />
                    </KeyboardAvoidingView>
                    <View style={styles.anonymousContainer}>
                        <Text style={styles.answer}>anonymous answers</Text>
                        <Switch
                            trackColor={{ false: colors.GREY_5, true: colors.PRIMARY_COLOR }}
                            thumbColor={colors.WHITE_2}
                            ios_backgroundColor={colors.GREY_5}
                            onValueChange={toggleSwitch}
                            value={anonymous}
                        />
                    </View>
                    <Button height={60} disabled={disabled()} onPress={postPoll}>
                        post
                    </Button>
                </View>
            </TouchableWithoutFeedback>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
        paddingHorizontal: 10,
    },
    view: {
        marginTop: 20,
    },
    anonymousContainer: {
        flexDirection: 'row',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 20,
        paddingHorizontal: 10,
    },
    answer: {
        textAlign: 'center',
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.BLACK,
    },
    label: {
        fontFamily: fonts.NEWYORKEXTRALARGE_BLACK,
        fontSize: 18,
        fontWeight: '500',
        color: colors.BLACK,
        marginBottom: 20,
    },
    input: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.BLACK,
        backgroundColor: colors.WHITE_2,
        borderRadius: 15,
        height: 50,
        paddingLeft: 20,
        paddingRight: 50,
        marginBottom: 10,
    },
    addOption: {
        backgroundColor: colors.WHITE_2,
        borderRadius: 15,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    closeIcon: {
        position: 'absolute',
        right: 15,
        top: 10,
        height: 30,
        width: 30,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
export default CreatePoll;
