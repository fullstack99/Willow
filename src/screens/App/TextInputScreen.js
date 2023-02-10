import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, TextInput, Keyboard, KeyboardAvoidingView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import { discardAlert } from '../../utility';
import HeaderIcon from '../../components/App/HeaderIcon';

const TextInputScreen = ({ navigation, route }) => {
    const firstUpdate = useRef(true);
    const insets = useSafeAreaInsets();
    const maxLength = route.params.maxLength || 200;
    const [unsaved, setUnsaved] = useState(false);
    const [text, setText] = useState(route.params.text || '');

    useLayoutEffect(() => {
        navigation.setOptions({
            title: route.params.title || '',
            headerRight: () => (
                <HeaderIcon onPress={onSave} style={{ width: 60, justifyContent: 'center' }}>
                    <Text style={styles.save}>save</Text>
                </HeaderIcon>
            ),
        });
    }, [navigation, text]);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        setUnsaved(true);
    }, [text]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!unsaved) return;

            e.preventDefault();
            Keyboard.dismiss();
            discardAlert(() => navigation.dispatch(e.data.action));
        });

        return () => unsubscribe && unsubscribe();
    }, [navigation, unsaved]);

    const onSave = () => {
        setUnsaved(false);
        Keyboard.dismiss();
        setTimeout(() => {
            route.params.onGoBack && route.params.onGoBack(text);
            navigation.goBack();
        }, 200);
    };

    return (
        <KeyboardAvoidingView style={GlobalStyles.container} behavior="padding" keyboardVerticalOffset={insets.bottom + 40}>
            <SafeAreaView style={GlobalStyles.container}>
                <TextInput
                    autoFocus
                    style={styles.textInput}
                    onChangeText={setText}
                    value={text}
                    placeholder={'type here...'}
                    returnKeyType="done"
                    blurOnSubmit
                    onSubmitEditing={Keyboard.dismiss}
                    multiline
                    maxLength={maxLength}
                    numberOfLines={1}
                />
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
};

export default TextInputScreen;

const styles = StyleSheet.create({
    save: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.PRIMARY_COLOR,
    },
    textInput: {
        flex: 1,
        flexGrow: 1,
        padding: 20,
        backgroundColor: colors.WHITE,
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 18,
    },
});
