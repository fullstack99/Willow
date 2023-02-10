import React, { useLayoutEffect, useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, Dimensions, Keyboard } from 'react-native';
import FastImage from 'react-native-fast-image';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { TextInput } from 'react-native-paper';
import { connect } from 'react-redux';
import { addPost, updatePost } from '../../actions/feedActions';
import GlobalStyles from '../../constants/globalStyles';
import { colors, fonts } from '../../constants';
import { TEXT_INPUT } from '../../navigator/constants';
import { REVIEWS } from '../../constants/Database';
import FirebaseFeed from '../../service/firebase_requests/Feed';
import FirebaseAnalytics from '../../service/firebase_analytics';
import FirebaseErrors from '../../service/firebase_errors';
import Remove from '../../assets/Images/Create/remove.svg';
import AddPhotoSquare from '../../assets/Images/Create/add-photo-square.png';
import GoldStar from '../../assets/Images/star.svg';
import GreyStar from '../../assets/Images/star-grey.svg';
import AttachProduct from '../../components/Create/AttachProduct';
import ChoosePhotoDialog from '../../components/Dialogs/ChoosePhotoDialog';
import RatingSlide from '../../components/Create/RatingSlide';
import Button from '../../components/Button';
import { discardAlert } from '../../utility';
const { width } = Dimensions.get('window');
const PHOTO_WIDTH = (width - 40) / 3 - 20;
const TITLE_LIMIT = 80;
const PROS_AND_CONS_LIMIT = 600;
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

const CreateReview = ({ navigation, route, addPost, updatePost }) => {
    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'create a review',
        });
    }, [navigation]);
    const insets = useSafeAreaInsets();
    const reviewDocument = route.params?.review || null;
    const choosePhotoRef = useRef();
    const firstUpdate = useRef(true);
    const [unsaved, setUnsaved] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [product, setProduct] = useState(reviewDocument?.product || '');
    const [title, setTitle] = useState(reviewDocument?.title || '');
    const [titleLimit, setTitleLimit] = useState(reviewDocument?.title ? TITLE_LIMIT - reviewDocument.title.length : TITLE_LIMIT);
    const [benefit, setBenefit] = useState(reviewDocument?.benefit || '');
    const [defect, setDefect] = useState(reviewDocument?.defect || '');
    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [images, setImages] = useState(reviewDocument?.image_url || ['']);
    const [easy_of_use, setEasyOfUse] = useState(reviewDocument?.easy_of_use || 0);
    const [design, setDesign] = useState(reviewDocument?.design || 0);
    const [build_quality, setBuildQuality] = useState(reviewDocument?.build_quality || 0);
    const [overall, setOverall] = useState(reviewDocument?.overall || 0);
    const [overallStars, setOverallStars] = useState(['', '', '', '', '']);

    useEffect(() => {
        if (images.length < 3 && images[images.length - 1] !== '') {
            setImages([...images, '']);
        }
    }, [images]);

    useEffect(() => {
        setOverallStars(overallStars.map((r, index) => (index < overall ? '*' : '')));
    }, [overall]);

    useEffect(() => {
        setTitleLimit(TITLE_LIMIT - title.length);
    }, [title, setTitleLimit]);

    useEffect(() => {
        if (firstUpdate.current) {
            firstUpdate.current = false;
            return;
        }
        setUnsaved(true);
    }, [title, benefit, defect, images, easy_of_use, design, build_quality, overall]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('beforeRemove', (e) => {
            if (!unsaved) return;

            Keyboard.dismiss();
            e.preventDefault();
            discardAlert(() => navigation.dispatch(e.data.action));
        });

        return () => unsubscribe && unsubscribe();
    }, [navigation, unsaved]);

    const navigateToTextInputScreen = (text, onGoBack) => {
        return (
            navigation &&
            navigation.navigate(TEXT_INPUT, {
                text,
                onGoBack,
                maxLength: PROS_AND_CONS_LIMIT,
            })
        );
    };

    const openImagePicker = (index) => {
        setCurrentImageIndex(index);
        choosePhotoRef.current && choosePhotoRef.current.open();
    };

    const onSelectImage = (imagePath) => {
        setImages(images.map((image, index) => (index === currentImageIndex ? imagePath : image)));
    };

    const removeImage = (currentIndex) => {
        discardAlert(
            () => setImages(images.filter((image, index) => index !== currentIndex)),
            'Remove Image',
            'Are you sure you want to remove this image?',
            'Remove',
            'Cancel',
        );
    };

    const submitReview = () => {
        const data = { ...reviewDocument, product, title, benefit, defect, overall, easy_of_use, design, build_quality };
        Keyboard.dismiss();
        setLoading(true);
        if (reviewDocument?.id) {
            FirebaseFeed.updateFeed(
                data,
                images.filter((image) => image),
            )
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
            FirebaseFeed.createFeed(
                REVIEWS,
                data,
                images.filter((image) => image),
            )
                .then((postReference) => {
                    setLoading(false);
                    addPost(postReference);
                    FirebaseAnalytics.logCreatePost(REVIEWS, postReference.id);
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
        <ScrollView style={[GlobalStyles.container, styles.container]} contentContainerStyle={{ paddingBottom: insets.bottom }}>
            <View>
                <AttachProduct
                    navigation={navigation}
                    product={product}
                    setProduct={setProduct}
                    title={`search for a product\non Amazon`}
                    required
                />
            </View>
            <View style={styles.inputSection}>
                <TextInput
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
                    label="pros"
                    value={benefit}
                    onTouchStart={() => navigateToTextInputScreen(benefit, setBenefit)}
                    editable={false}
                    style={styles.input}
                    showSoftInputOnFocus={false}
                    theme={theme}
                    maxLength={PROS_AND_CONS_LIMIT}
                />
            </View>
            <View style={styles.inputSection}>
                <TextInput
                    label="cons"
                    value={defect}
                    onTouchStart={() => navigateToTextInputScreen(defect, setDefect)}
                    editable={false}
                    style={styles.input}
                    showSoftInputOnFocus={false}
                    theme={theme}
                    maxLength={PROS_AND_CONS_LIMIT}
                />
            </View>

            <View style={styles.imageInputSection}>
                {images.map((image, index) => {
                    if (!image) {
                        return (
                            <TouchableOpacity
                                key={index.toString()}
                                style={styles.imageContainer}
                                onPress={() => openImagePicker(index)}>
                                <FastImage
                                    source={AddPhotoSquare}
                                    resizeMode={FastImage.resizeMode.contain}
                                    style={styles.imagePlaceholder}
                                />
                            </TouchableOpacity>
                        );
                    } else {
                        return (
                            <TouchableOpacity
                                key={index.toString()}
                                style={styles.imageContainer}
                                onPress={() => openImagePicker(index)}>
                                <FastImage
                                    source={{ uri: image }}
                                    resizeMode={FastImage.resizeMode.contain}
                                    style={[styles.imagePlaceholder, styles.image]}
                                />
                                <TouchableOpacity style={styles.removeIcon} onPress={() => removeImage(index)}>
                                    <Remove />
                                </TouchableOpacity>
                            </TouchableOpacity>
                        );
                    }
                })}
            </View>

            <View style={styles.ratingSection}>
                <Text style={styles.yourRatingTitle}>your rating</Text>
                <RatingSlide key="easy_of_use" title="easy of use" rating={easy_of_use} setRating={setEasyOfUse} />
                <RatingSlide key="design" title="design" rating={design} setRating={setDesign} />
                <RatingSlide key="build_quality" title="build quality" rating={build_quality} setRating={setBuildQuality} />
            </View>

            <View style={styles.overallSection}>
                <Text style={styles.yourRatingTitle}>overall</Text>
                <View style={styles.overallRatingContainer}>
                    {overallStars.map((s, index) => {
                        if (!s) {
                            return (
                                <TouchableOpacity
                                    key={index.toString()}
                                    style={styles.starContainer}
                                    onPress={() => setOverall(index + 1)}>
                                    <GreyStar width={36} height={36} />
                                </TouchableOpacity>
                            );
                        } else {
                            return (
                                <TouchableOpacity
                                    key={index.toString()}
                                    style={styles.starContainer}
                                    onPress={() => setOverall(index + 1)}>
                                    <GoldStar width={36} height={36} />
                                </TouchableOpacity>
                            );
                        }
                    })}
                </View>
            </View>

            <Button onPress={submitReview} disabled={!product || !title || !benefit || !defect || !overall} width={'90%'}>
                publish
            </Button>

            <ChoosePhotoDialog
                forwardRef={choosePhotoRef}
                onPhotoClick={onSelectImage}
                imagePickerOptions={{ width: width * 0.65, aspectRatio: 1.2 }}
            />
        </ScrollView>
    );
};

const mapStateToProps = (state) => ({});

const mapDispatchToProps = {
    addPost,
    updatePost,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateReview);

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: 20,
        paddingVertical: 30,
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
    imageInputSection: {
        flexDirection: 'row',
    },
    imageContainer: {
        padding: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
    imagePlaceholder: {
        width: PHOTO_WIDTH,
        height: PHOTO_WIDTH * 0.8,
    },
    image: {
        borderRadius: 20,
    },
    removeIcon: {
        position: 'absolute',
        bottom: 0,
        right: 0,
    },
    ratingSection: {
        width: '100%',
        marginVertical: 20,
    },
    yourRatingTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 18,
        paddingBottom: 30,
    },
    overallSection: {
        marginBottom: 40,
    },
    overallRatingContainer: {
        flexDirection: 'row',
    },
    starContainer: {
        marginRight: 20,
    },
});
