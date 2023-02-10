import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, SafeAreaView, Text, View, Keyboard } from 'react-native';
import { connect } from 'react-redux';
import { addPost, updatePost } from '../../actions/feedActions';
import { TextInput } from 'react-native-paper';
import GlobalStyles from '../../constants/globalStyles';
import { fonts, colors } from '../../constants';
import { TEXT_INPUT } from '../../navigator/constants';
import { TIPS } from '../../constants/Database';
import Feed from '../../service/firebase_requests/Feed';
import FirebaseAnalytics from '../../service/firebase_analytics';
import FirebaseErrors from '../../service/firebase_errors';
import SelectPhotoSection from '../../components/Create/SelectPhotoSection';
import Toast from '../../components/Toast';
import LoadingDotsOverlay from '../../components/LoadingDotsOverlay';
import Button from '../../components/Button';
import AttachProduct from '../../components/Create/AttachProduct';
import VisibilityDialog from '../../components/Dialogs/VisibilityDialog';
const TITLE_LIMIT = 80;
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

const CreateTips = ({ navigation, route, user, addPost, updatePost }) => {
    const tip = route.params.tip;
    if (!tip) return null;
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [title, setTitle] = useState(tip?.title || '');
    const [titleLimit, setTitleLimit] = useState(tip?.title ? TITLE_LIMIT - tip.title.length : TITLE_LIMIT);
    const [photo, setPhoto] = useState(tip?.image_url || null);
    const [visibility, setVisibility] = useState(tip?.visibility || 'everyone');
    const [product, setProduct] = useState(tip?.product || null);
    const visibilityDialogRef = useRef();

    useLayoutEffect(() => {
        navigation.setOptions({
            title: tip?.id ? 'update' : 'create a tip',
        });
    }, [navigation, tip]);

    useEffect(() => {
        setTitleLimit(TITLE_LIMIT - title.length);
    }, [title, setTitleLimit]);

    const openVisibilityPicker = () => {
        Keyboard.dismiss();
        visibilityDialogRef.current && visibilityDialogRef.current.open();
    };

    const postTip = () => {
        setLoading(true);
        const data = { ...tip, title, visibility, product };
        if (tip.id) {
            Feed.updateFeed(data, photo)
                .then((updatedFeed) => {
                    setLoading(false);
                    updatePost(updatedFeed);
                    return navigation && navigation.pop(2);
                })
                .catch((error) => {
                    console.log(error);
                    setLoading(false);
                    return FirebaseErrors.setError(error, setError);
                });
        } else {
            Feed.createFeed(TIPS, data, photo)
                .then((postReference) => {
                    setLoading(false);
                    addPost(postReference);
                    FirebaseAnalytics.logCreatePost(TIPS, postReference.id);
                    return navigation && navigation.pop(2);
                })
                .catch((error) => {
                    console.log(error);
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
                <SelectPhotoSection photo={photo} setPhoto={setPhoto} data={{ type: 'TIPS', ...tip }} />

                <View style={styles.inputContainer}>
                    <View style={styles.inputSection}>
                        <TextInput
                            autoCapitalize="sentences"
                            autoCorrect={false}
                            returnKeyType="done"
                            label="title"
                            value={title}
                            onChangeText={setTitle}
                            style={styles.input}
                            theme={theme}
                            maxLength={TITLE_LIMIT}
                        />
                        <Text style={styles.titleLimit}>
                            {titleLimit} {titleLimit === 1 ? 'character' : 'characters'} left
                        </Text>
                    </View>
                    <View style={styles.inputSection}>
                        <TextInput
                            label="who can view this?"
                            style={styles.input}
                            theme={theme}
                            editable={false}
                            onTouchStart={openVisibilityPicker}
                            showSoftInputOnFocus={false}
                            value={visibility}
                        />
                    </View>
                    <View style={styles.inputSection}>
                        <AttachProduct navigation={navigation} product={product} setProduct={setProduct} />
                    </View>
                </View>
                <Button onPress={postTip} disabled={loading || title.length < 2} width={'90%'}>
                    post
                </Button>
            </View>
            <VisibilityDialog
                forwardRef={visibilityDialogRef}
                userAvatar={user.avatar_url}
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

export default connect(mapStateToProps, mapDispatchToProps)(CreateTips);

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
    titleLimit: {
        textAlign: 'right',
        paddingTop: 5,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 12,
        color: colors.DARK_GREY,
    },
});
