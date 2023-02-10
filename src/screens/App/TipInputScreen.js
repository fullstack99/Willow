import React, { useLayoutEffect, useEffect, useState, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Keyboard, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import { CREATE_TIP } from '../../navigator/constants';
import { discardAlert } from '../../utility';
import HeaderIcon from '../../components/App/HeaderIcon';
import KeyboardSpacer from 'react-native-keyboard-spacer';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

const TipInputScreen = ({ navigation, route }) => {
    const tip = route.params?.tip || null;
    const firstUpdate = useRef(true);
    const [unsaved, setUnsaved] = useState(false);
    const [content, setContent] = useState(tip?.content || '');
    const richTextEditorRef = useRef();
    const insets = useSafeAreaInsets();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: tip?.id ? 'update' : 'create a tip',
            headerRight: () => (
                <HeaderIcon onPress={onSave} style={{ width: 60, justifyContent: 'center' }}>
                    <Text style={styles.save}>save</Text>
                </HeaderIcon>
            ),
        });
    }, [navigation, tip, content]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!unsaved) return;

            Keyboard.dismiss();
            e.preventDefault();
            discardAlert(() => navigation.dispatch(e.data.action));
        });

        return () => unsubscribe && unsubscribe();
    }, [navigation, unsaved]);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        setUnsaved(true);
    }, [content]);

    const onSave = () => {
        setUnsaved(false);
        Keyboard.dismiss();
        setTimeout(() => {
            navigation.navigate(CREATE_TIP, { tip: { ...tip, content } });
        }, 200);
    };

    const onEditorInitialized = () => {
        console.log('editor ready!');
    };

    const onChange = (content) => {
        setContent(content);
    };

    const onMessage = (data) => {
        console.log('onMessage');
        console.log(data);
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <RichEditor
                ref={richTextEditorRef}
                placeholder={'type here...'}
                initialFocus
                initialContentHTML={content}
                editorInitializedCallback={onEditorInitialized}
                useContainer={false}
                onChange={onChange}
                onMessage={onMessage}
                scrollEnabled
                autoCapitalize="sentences"
            />
            <RichToolbar
                editor={richTextEditorRef}
                actions={[
                    actions.keyboard,
                    actions.undo,
                    actions.redo,
                    actions.setBold,
                    actions.setItalic,
                    actions.insertLink,
                    actions.setStrikethrough,
                    actions.checkboxList,
                    actions.insertOrderedList,
                    actions.blockquote,
                    actions.alignLeft,
                    actions.alignCenter,
                    actions.alignRight,
                    actions.line,
                ]}
                iconTint={colors.PRIMARY_COLOR}
                selectedIconTint={colors.WHITE}
                selectedButtonStyle={{ backgroundColor: colors.PRIMARY_COLOR }}
            />
            {Platform.OS == 'ios' ? <KeyboardSpacer topSpacing={-insets.bottom} /> : null}
        </SafeAreaView>
    );
};

export default TipInputScreen;

const styles = StyleSheet.create({
    textEditor: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
    },
    save: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.PRIMARY_COLOR,
    },
});
