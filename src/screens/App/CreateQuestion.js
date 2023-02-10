import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, ScrollView, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { addPost, updatePost } from '../../actions/feedActions';
import { TextInput } from 'react-native-paper';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import { TEXT_INPUT } from '../../navigator/constants';
import { QUESTIONS } from '../../constants/Database';
import Feed from '../../service/firebase_requests/Feed';
import FirebaseAnalytics from '../../service/firebase_analytics';
import FirebaseErrors from '../../service/firebase_errors';
import SelectPhotoSection from '../../components/Create/SelectPhotoSection';
import Toast from '../../components/Toast';
import LoadingDotsOverlay from '../../components/LoadingDotsOverlay';
import AttachProduct from '../../components/Create/AttachProduct';
import Button from '../../components/Button';
import VisibilityDialog from '../../components/Dialogs/VisibilityDialog';
import { discardAlert } from '../../utility';

const theme = {
    colors: {
        placeholder: colors.DARK_GREY,
        text: colors.BLACK,
        primary: colors.DARK_GREY,
        underlineColor: 'transparent',
        backgroundColor: 'transparent',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 15,
    },
};

const CreateQuestion = ({ navigation, user, route, addPost, updatePost }) => {
    const questionDocument = route.params?.question || null;
    const [loading, setLoading] = useState(false);
    const [unsaved, setUnsaved] = useState(false);
    const [error, setError] = useState('');
    const [photo, setPhoto] = useState(questionDocument?.image_url || null);
    const [question, setQuestion] = useState(questionDocument?.question || '');
    const [visibility, setVisibility] = useState(questionDocument?.visibility || 'everyone');
    const [anonymous, setAnonymous] = useState(questionDocument?.anonymous || false);
    const [product, setProduct] = useState(questionDocument?.product || null);
    const visibilityDialogRef = useRef();
    const firstUpdate = useRef(true);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: questionDocument?.id ? 'update' : 'create a question',
        });
    }, [navigation]);

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
    }, [question, photo, visibility, anonymous]);

    const openVisibilityPicker = () => {
        visibilityDialogRef.current && visibilityDialogRef.current.open();
    };

    const navigateToTextInputScreen = () => {
        navigation &&
            navigation.navigate(TEXT_INPUT, {
                title: questionDocument?.id ? 'update' : 'question',
                text: question,
                onGoBack: setQuestion,
            });
    };

    const postQuestion = () => {
        const data = { ...questionDocument, visibility, anonymous, question, product };
        Keyboard.dismiss();
        setLoading(true);
        if (questionDocument?.id) {
            Feed.updateFeed(data, photo)
                .then((updatedFeed) => {
                    setLoading(false);
                    updatePost(updatedFeed);
                    setUnsaved(false);
                    return setTimeout(() => navigation && navigation.goBack(), 500);
                })
                .catch((error) => {
                    setLoading(false);
                    return FirebaseErrors.setError(error, setError);
                });
        } else {
            Feed.createFeed(QUESTIONS, data, photo)
                .then((postReference) => {
                    setLoading(false);
                    addPost(postReference);
                    FirebaseAnalytics.logCreatePost(QUESTIONS, postReference.id);
                    setUnsaved(false);
                    return setTimeout(() => navigation && navigation.goBack(), 500);
                })
                .catch((error) => {
                    setLoading(false);
                    return FirebaseErrors.setError(error, setError);
                });
        }
    };

    return (
        <SafeAreaView style={GlobalStyles.alignCenterContainer}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <LoadingDotsOverlay animation={loading} />
            <View style={styles.container}>
                <SelectPhotoSection photo={photo} setPhoto={setPhoto} data={questionDocument} />

                <View style={styles.inputContainer}>
                    <View style={styles.inputSection}>
                        <TextInput
                            label="question"
                            value={question}
                            onTouchStart={navigateToTextInputScreen}
                            editable={false}
                            style={styles.input}
                            showSoftInputOnFocus={false}
                            theme={theme}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <TextInput
                            label="who can view this?"
                            style={styles.input}
                            theme={theme}
                            editable={false}
                            onTouchStart={openVisibilityPicker}
                            showSoftInputOnFocus={false}
                            value={anonymous ? `${visibility}, anonymously` : visibility}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <AttachProduct navigation={navigation} product={product} setProduct={setProduct} />
                    </View>
                </View>
                <Button onPress={postQuestion} disabled={loading || question.length < 2} width={'90%'}>
                    post
                </Button>
            </View>
            <VisibilityDialog
                forwardRef={visibilityDialogRef}
                userAvatar={user.avatar_url}
                anonymous={anonymous}
                setAnonymous={setAnonymous}
                visibility={visibility}
                setVisibility={setVisibility}
            />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {
    addPost,
    updatePost,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateQuestion);

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
    },
    inputContainer: {
        flexGrow: 1,
        marginHorizontal: 20,
    },
    inputSection: {
        width: '100%',
        marginBottom: 20,
    },
    input: {
        backgroundColor: 'transparent',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 20,
    },
});
