import React, { useState, useLayoutEffect, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Image, TouchableOpacity, Dimensions, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import branch from 'react-native-branch';
import Share from 'react-native-share';
import { ImageHeaderScrollView, TriggeringView } from 'react-native-image-header-scroll-view';
import GlobalStyles from '../../constants/globalStyles';
import { colors, fonts, emoji } from '../../constants';
import { SHARE_IN_WILLOW, WEBVIEW } from '../../navigator/constants';
import FirebaseProduct from '../../service/firebase_requests/Product';
import FirebaseAnalytics from '../../service/firebase_analytics';
import User from '../../service/firebase_requests/User';
import FirebaseErrors from '../../service/firebase_errors';
import AuthDialog from '../../components/App/AuthDialog';
import ItemShareDialog from '../../components/Dialogs/ItemShareDialog';
import ItemButtonDialog from '../../components/Dialogs/ItemButtonDialog';
import TipsHeader from '../../components/Tips/TipsHeader';
import Rating from '../../components/Rating';
import Button from '../../components/Button';
import Toast from '../../components/Toast';
import LoadingDotsOverlay from '../../components/LoadingDotsOverlay';
import HeaderIcon from '../../components/App/HeaderIcon';
import EmptyState from '../../components/Product/EmptyState';
import About from '../../components/Product/About';
import Reviews from '../../components/Product/Reviews';
import Questions from '../../components/Product/Questions';
import Tips from '../../components/Product/Tips';

const { width, height } = Dimensions.get('window');
const MAX_HEIGHT = height * 0.35;
const MIN_HEIGHT = Platform.OS === 'ios' ? 120 : 55;

const Products = ({ navigation, route }) => {
    const product_asin = route.params?.productID || null;
    const product_price = route.params?.productPrice || null;
    const user = useSelector((state) => state.auth.user);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [product, setProduct] = useState(null);
    const [tips, setTips] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [added, setAdded] = useState(null);
    const [tabs, setTabs] = useState([
        { key: 0, title: 'about', focused: true, onPress: () => selectTab(0) },
        { key: 1, title: 'reviews', focused: false, onPress: () => selectTab(1) },
        { key: 2, title: 'q&a', focused: false, onPress: () => selectTab(2) },
        { key: 3, title: 'tips', focused: false, onPress: () => selectTab(3) },
    ]);
    const authDialogRef = useRef();
    const itemShareDialogRef = useRef();
    const itemButtonDialogRef = useRef();

    useLayoutEffect(() => {
        if (product?.title || product?.asin) {
            navigation.setOptions({
                headerShown: false,
                headerLeft: null,
            });
        } else {
            navigation.setOptions({
                headerShown: true,
                title: '',
                headerStyle: {
                    backgroundColor: colors.WHITE,
                    borderBottomWidth: 0,
                    shadowColor: 'transparent',
                },
                headerTintColor: colors.WHITE,
                headerTitleStyle: {
                    fontFamily: fonts.NEWYORKEXTRALARGE_MEDIUM,
                    fontSize: 18,
                    color: colors.BLACK,
                },
                headerLeft: ({ onPress }) => {
                    return <HeaderIcon onPress={onPress} />;
                },
            });
        }
    }, [navigation, product]);

    useEffect(() => {
        Promise.all([
            FirebaseProduct.getProductByASIN(product_asin),
            FirebaseProduct.getTipsByProductASIN(product_asin),
            FirebaseProduct.getQuestionsByProductASIN(product_asin),
            FirebaseProduct.getReviewsByProductASIN(product_asin),
            User.checkIfItemIsAdded(product_asin),
        ])
            .then((res) => {
                setProduct(res[0]);
                setTips(res[1]);
                setQuestions(res[2]);
                setReviews(res[3]);
                setAdded(res[4]);
            })
            .catch((error) => {
                console.log(error);
                setProduct({});
                setAdded(null);
                FirebaseErrors.setError(error, setError);
            });
    }, [product_asin]);

    const goBack = () => navigation.goBack();

    const selectTab = (tabKey) => {
        if (tabKey > tabs.length - 1) return;
        return setTabs(tabs.map((t) => (t.key === tabKey ? { ...t, focused: true } : { ...t, focused: false })));
    };

    const productLinkOnPress = () => {
        navigation && product?.link && navigation.push(WEBVIEW, { uri: product.link, title: product?.title || '' });
    };

    const toggleAddOrDeleteItem = () => {
        if (itemButtonDialogRef.current) {
            itemButtonDialogRef.current.state.modalVisible
                ? itemButtonDialogRef.current.close()
                : itemButtonDialogRef.current.open();
        }
    };

    const addOrDeleteItemOnPress = () => {
        if (!user) authDialogRef.current && authDialogRef.current.open();
        else if (added !== null && product) {
            setLoading(true);
            if (!added) {
                return User.addItem(product)
                    .then(() => {
                        setAdded(true);
                        product?.asin && FirebaseAnalytics.logSavedProduct(product.asin);
                    })
                    .catch((error) => {
                        console.log(error);
                        FirebaseErrors.setError(error, setError);
                    })
                    .finally(() => setLoading(false));
            } else {
                return User.removeItem(product_asin)
                    .then(() => setAdded(false))
                    .catch((error) => {
                        console.log(error);
                        FirebaseErrors.setError(error, setError);
                    })
                    .finally(() => setLoading(false));
            }
        } else {
            return;
        }
    };

    const onAmazonPress = () => {
        toggleAddOrDeleteItem();
        product?.asin && FirebaseAnalytics.logAmazonItemClick(product.asin);
        setTimeout(productLinkOnPress, 500);
    };

    const _settingOnPress = () => {
        itemShareDialogRef.current && itemShareDialogRef.current.open();
    };

    const _closeShareDialog = () => {
        itemShareDialogRef.current && itemShareDialogRef.current.close();
    };

    const onMessagePress = () => {
        _closeShareDialog();
        setTimeout(() => {
            branch
                .createBranchUniversalObject(product.asin, {
                    locallyIndex: true,
                    title: 'check this out',
                    contentDescription: product.title,
                })
                .then((branchObject) => {
                    if (branchObject) {
                        const linkProperties = {
                            feature: 'share',
                            channel: 'facebook',
                        };
                        const controlParams = {
                            $desktop_url: 'https://www.willow.app',
                            $canonical_identifier: product.asin,
                            data: {
                                type: 'share_item',
                                product,
                            },
                        };
                        branchObject.generateShortUrl(linkProperties, controlParams).then(({ url }) => {
                            Share.open({
                                title: 'check this out',
                                message: `check out this item on willow! ${url}`,
                            }).catch(console.log);
                        });
                    }
                })
                .catch(console.log);
        }, 500);
    };

    const onWillowPress = () => {
        _closeShareDialog();
        if (!user || !user?.uid) {
            return setTimeout(() => authDialogRef.current && authDialogRef.current.open(), 500);
        } else {
            return setTimeout(
                () => navigation && navigation.push(SHARE_IN_WILLOW, { data: { ...product, type: 'share_item' } }),
                500,
            );
        }
    };

    if (!product)
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <LoadingDotsOverlay animation={!product} />
            </SafeAreaView>
        );
    else if (!product.title || !product.asin) {
        return (
            <SafeAreaView style={styles.noProductContainer}>
                <EmptyState title="sorry, this product is no longer available" />
            </SafeAreaView>
        );
    } else {
        return (
            <SafeAreaView style={GlobalStyles.container}>
                <ImageHeaderScrollView
                    maxHeight={MAX_HEIGHT}
                    minHeight={MIN_HEIGHT}
                    renderHeader={() => (
                        <Image
                            source={{
                                uri: product?.main_image?.link || (Array.isArray(product?.images) && product.images[0]) || null,
                            }}
                            style={styles.image}
                        />
                    )}
                    bounces={false}
                    renderTouchableFixedForeground={() => <TipsHeader onPress={goBack} settingOnPress={_settingOnPress} />}>
                    <TriggeringView style={{ paddingBottom: 80 }}>
                        <View style={GlobalStyles.toastErrorContainer}>
                            <Toast error={error} close={() => setError('')} />
                        </View>
                        <LoadingDotsOverlay animation={loading} />
                        <View style={styles.titleContainer}>
                            <Text style={styles.title} numberOfLines={2}>
                                {product?.title}
                            </Text>
                            <Text style={styles.price}>
                                {product?.price?.raw || product?.buybox_winner?.price?.raw || product_price || ''}
                            </Text>
                        </View>

                        <View style={styles.subtitleContainer}>
                            <Text style={styles.subtitle}>
                                selling website:{' '}
                                <Text style={styles.productLink} onPress={productLinkOnPress}>
                                    amazon.com
                                </Text>
                            </Text>
                            <Rating rating={product?.rating} showNumber />
                        </View>

                        <View style={styles.infoBarsContainer}>
                            <View style={styles.infoBar}>
                                <View style={styles.infoIconShadow} />
                                <Text style={styles.infoIcon}>{emoji.star}</Text>
                                <Text style={styles.infoTitle}>reviews</Text>
                                <Text style={styles.infoNumber}>{reviews.length}</Text>
                            </View>
                            <View style={styles.infoBar}>
                                <View style={styles.infoIconShadow} />
                                <Text style={styles.infoIcon}>{emoji.messages}</Text>
                                <Text style={styles.infoTitle}>questions</Text>
                                <Text style={styles.infoNumber}>{questions.length}</Text>
                            </View>
                            <View style={styles.infoBar}>
                                <View style={styles.infoIconShadow} />
                                <Text style={styles.infoIcon}>{emoji.excited}</Text>
                                <Text style={styles.infoTitle}>tips</Text>
                                <Text style={styles.infoNumber}>{tips.length}</Text>
                            </View>
                        </View>

                        {added !== null && (
                            <Button
                                onPress={toggleAddOrDeleteItem}
                                style={{ backgroundColor: colors.PRIMARY_COLOR }}
                                disabled={loading}
                                height={65}>
                                buy or save item
                            </Button>
                        )}

                        <View style={styles.tabBarContainer}>
                            {tabs.map((item) => (
                                <TouchableOpacity
                                    key={item.key}
                                    style={[
                                        styles.tabTitleContainer,
                                        { borderBottomColor: item.focused ? colors.PRIMARY_COLOR : colors.GREY },
                                    ]}
                                    onPress={item.onPress}>
                                    <Text
                                        style={[styles.tabTitle, { color: item.focused ? colors.PRIMARY_COLOR : colors.BLACK }]}>
                                        {item.title}
                                    </Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <About product={product} show={tabs[0].focused} />
                        <Reviews
                            product={product}
                            show={tabs[1].focused}
                            data={reviews}
                            navigation={navigation}
                            setLoading={setLoading}
                            setError={setError}
                        />
                        <Questions
                            product={product}
                            show={tabs[2].focused}
                            data={questions}
                            navigation={navigation}
                            setLoading={setLoading}
                            setError={setError}
                        />
                        <Tips
                            product={product}
                            show={tabs[3].focused}
                            data={tips}
                            navigation={navigation}
                            setLoading={setLoading}
                            setError={setError}
                        />
                    </TriggeringView>
                </ImageHeaderScrollView>
                <AuthDialog authDialogRef={authDialogRef} navigation={navigation} />
                <ItemShareDialog
                    forwardRef={itemShareDialogRef}
                    navigation={navigation}
                    onMessagePress={onMessagePress}
                    onWillowPress={onWillowPress}
                />
                <ItemButtonDialog
                    forwardRef={itemButtonDialogRef}
                    onPress={addOrDeleteItemOnPress}
                    onAmazonPress={onAmazonPress}
                    added={added}
                />
            </SafeAreaView>
        );
    }
};

export default Products;

const styles = StyleSheet.create({
    loadingContainer: {
        flex: 1,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    noProductContainer: {
        flex: 1,
        backgroundColor: colors.WHITE,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 20,
    },
    container: {
        flex: 1,
        backgroundColor: colors.WHITE,
    },
    image: {
        height: MAX_HEIGHT,
        width: width,
        resizeMode: 'contain',
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
        marginHorizontal: 20,
    },
    title: {
        flex: 1,
        paddingRight: 15,
        fontSize: 30,
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
    },
    price: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
    },
    subtitleContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginHorizontal: 20,
        marginBottom: 30,
    },
    subtitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 13,
    },
    productLink: {
        fontFamily: fonts.MULISH_BOLD,
    },
    infoBarsContainer: {
        marginHorizontal: 20,
    },
    infoBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 25,
    },
    infoIcon: {
        paddingLeft: 5,
        paddingRight: 20,
    },
    infoIconShadow: {
        position: 'absolute',
        backgroundColor: colors.GREY,
        width: 30,
        height: 30,
        borderRadius: 30 / 2,
    },
    infoTitle: {
        flex: 1,
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
    infoNumber: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
    },
    authorRowContainer: {
        flexDirection: 'row',
        marginHorizontal: 20,
    },
    avatar: {
        width: 50,
        height: 50,
        borderRadius: 50 / 2,
    },
    authorNameContainer: {
        flex: 1,
        justifyContent: 'space-evenly',
        marginLeft: 10,
    },
    name: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 18,
    },
    timestamp: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: '#a2a2a2',
    },
    votingContainer: {
        width: 100,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        borderRadius: 20,
        backgroundColor: colors.GREY,
    },
    votes: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 18,
    },
    contentContainer: {
        padding: 20,
        backgroundColor: colors.WHITE,
    },
    commentContainer: {
        paddingHorizontal: 20,
        paddingVertical: 30,
        backgroundColor: colors.GREY,
    },
    commentTitle: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 24,
    },
    showAllCommentsButton: {
        width: '100%',
        alignItems: 'center',
        backgroundColor: colors.WHITE,
        borderRadius: 20,
        paddingVertical: 15,
    },
    showAllCommentsText: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 13,
        color: '#7c7c7c',
    },
    tabBarContainer: {
        width: '100%',
        flexDirection: 'row',
    },
    tabTitleContainer: {
        width: '25%',
        alignItems: 'center',
        borderBottomColor: colors.GREY,
        borderBottomWidth: 2,
        paddingVertical: 20,
    },
    tabTitle: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.BLACK,
    },
});

// class Products extends Component {
//     constructor(props) {
//         super(props);
//         this.state = {
//             reviews: [],
//             questions: [],
//             tips: [],
//             product: props.route.params.product || null,
//             product_asin: props.route.params.asin || null,
//             tabs: [
//                 { key: 0, title: 'About', focused: true, onPress: () => this.selectTab(0) },
//                 { key: 1, title: 'Reviews', focused: false, onPress: () => this.selectTab(1) },
//                 { key: 2, title: 'Q&A', focused: false, onPress: () => this.selectTab(2) },
//                 { key: 3, title: 'Tips', focused: false, onPress: () => this.selectTab(3) },
//             ],
//             error: '',
//         };
//         this.authDialogRef = React.createRef();
//     }
//     componentDidMount() {
//         if (!this.state.product_asin) this.setState({ ...this.state, error: 'Missing product_id.' });
//         else {
//             this.reviewsUnsubscribe = firestore()
//                 .collection(FEED)
//                 .where('type', '==', REVIEWS)
//                 .where('product_asin', '==', this.state.product_asin)
//                 .orderBy('number_of_upvote', 'desc')
//                 .onSnapshot(
//                     (querySnapshot) => {
//                         querySnapshot.docChanges().forEach((reviewSnapshot) => {
//                             const review = { id: reviewSnapshot.doc.id, ...reviewSnapshot.doc.data() };
//                             switch (reviewSnapshot.type) {
//                                 case 'added':
//                                     const newReviews = this.state.reviews;
//                                     this.state.reviews.find((pr) => pr.id === review.id) === undefined && newReviews.push(review);
//                                     return this.setState({ ...this.state, reviews: newReviews });
//                                 case 'modified':
//                                     return this.setState({
//                                         ...this.state,
//                                         reviews: this.state.reviews.map((pr) => (pr.id === review.id ? review : pr)),
//                                     });
//                                 case 'removed':
//                                     return this.setState({
//                                         ...this.state,
//                                         reviews: this.state.reviews.filter((pr) => pr.id !== review.id),
//                                     });
//                             }
//                         });
//                     },
//                     (error) => {
//                         console.log(error);
//                     },
//                 );

//             this.questionsUnsubscribe = firestore()
//                 .collection(FEED)
//                 .where('type', '==', QUESTIONS)
//                 .where('product_asin', '==', this.state.product_asin)
//                 .orderBy('number_of_upvote', 'desc')
//                 .onSnapshot(
//                     (querySnapshot) => {
//                         querySnapshot.docChanges().forEach((questionSnapshot) => {
//                             const review = { id: questionSnapshot.doc.id, ...questionSnapshot.doc.data() };
//                             switch (questionSnapshot.type) {
//                                 case 'added':
//                                     const newQuestions = this.state.questions;
//                                     this.state.questions.find((pr) => pr.id === review.id) === undefined &&
//                                         newQuestions.push(review);
//                                     return this.setState({ ...this.state, questions: newQuestions });
//                                 case 'modified':
//                                     return this.setState({
//                                         ...this.state,
//                                         questions: this.state.questions.map((pr) => (pr.id === review.id ? review : pr)),
//                                     });
//                                 case 'removed':
//                                     return this.setState({
//                                         ...this.state,
//                                         questions: this.state.questions.filter((pr) => pr.id !== review.id),
//                                     });
//                             }
//                         });
//                     },
//                     (error) => {
//                         console.log(error);
//                     },
//                 );

//             this.tipsUnsubscribe = firestore()
//                 .collection(FEED)
//                 .where('type', '==', TIPS)
//                 .where('product_asin', '==', this.state.product_asin)
//                 .orderBy('number_of_upvote', 'desc')
//                 .onSnapshot(
//                     (querySnapshot) => {
//                         querySnapshot.docChanges().forEach((tipSnapshot) => {
//                             const tip = { id: tipSnapshot.doc.id, ...tipSnapshot.doc.data() };
//                             switch (tipSnapshot.type) {
//                                 case 'added':
//                                     const newTips = this.state.tips;
//                                     this.state.tips.find((pr) => pr.id === tip.id) === undefined && newTips.push(tip);
//                                     return this.setState({ ...this.state, tips: newTips });
//                                 case 'modified':
//                                     return this.setState({
//                                         ...this.state,
//                                         tips: this.state.tips.map((pr) => (pr.id === tip.id ? tip : pr)),
//                                     });
//                                 case 'removed':
//                                     return this.setState({
//                                         ...this.state,
//                                         tips: this.state.tips.filter((pr) => pr.id !== tip.id),
//                                     });
//                             }
//                         });
//                     },
//                     (error) => {
//                         console.log(error);
//                     },
//                 );
//         }
//     }
//     componentWillUnmount() {
//         this.reviewsUnsubscribe && this.reviewsUnsubscribe();
//         this.questionsUnsubscribe && this.questionsUnsubscribe();
//         this.tipsUnsubscribe && this.tipsUnsubscribe();
//     }

//     goBack = () => {
//         this.props.navigation && this.props.navigation.canGoBack() && this.props.navigation.goBack();
//     };

//     selectTab = (tabKey) => {
//         if (tabKey > this.state.tabs.length - 1) return;
//         return this.setState({
//             ...this.state,
//             tabs: this.state.tabs.map((t) => (t.key === tabKey ? { ...t, focused: true } : { ...t, focused: false })),
//         });
//     };

//     shareOnPress = () => {
//         if (!this.props.user) this.authDialogRef.current.open && this.authDialogRef.current.open();
//         else {
//             // Share
//         }
//     };

//     bookmarkOnPress = () => {
//         if (!this.props.user) this.authDialogRef.current.open && this.authDialogRef.current.open();
//         else {
//             // Check bookmark status
//         }
//     };

//     productLinkOnPress = () => {
//         this.state.product.link && Linking.openURL(`${this.state.product.link}`);
//     };

//     addOrDeleteItemOnPress = () => {
//         if (!this.props.user) this.authDialogRef.current.open && this.authDialogRef.current.open();
//         else {
//             // Check bookmark status
//         }
//     };

//     render() {
//         const { product, product_asin, reviews, questions, tips, tabs } = this.state;

//         if (!product)
//             return (
//                 <SafeAreaView style={styles.loadingContainer}>
//                     <ActivityIndicator size="large" color={colors.PRIMARY_COLOR} />
//                 </SafeAreaView>
//             );

//         return (
//             <View style={GlobalStyles.container}>
//                 <ImageHeaderScrollView
//                     maxHeight={MAX_HEIGHT}
//                     minHeight={MIN_HEIGHT}
//                     renderHeader={() => <Image source={{ uri: product.image }} style={styles.image} />}
//                     bounces={false}
//                     renderTouchableFixedForeground={() => (
//                         <TipsHeader
//                             onPress={this.goBack}
//                             bookmarkOnPress={this.bookmarkOnPress}
//                             shareOnPress={this.shareOnPress}
//                         />
//                     )}>
//                     <TriggeringView style={{ paddingBottom: 80 }}>
//                         <View style={styles.titleContainer}>
//                             <Text style={styles.title} numberOfLines={2}>
//                                 {product.title}
//                             </Text>
//                             <Text style={styles.price}>{product.price.raw}</Text>
//                         </View>

//                         <View style={styles.subtitleContainer}>
//                             <Text style={styles.subtitle}>
//                                 Selling website:{' '}
//                                 <Text style={styles.productLink} onPress={this.productLinkOnPress}>
//                                     amazon.com
//                                 </Text>
//                             </Text>
//                             <Rating rating={product.rating} showNumber />
//                         </View>

//                         <View style={styles.infoBarsContainer}>
//                             <View style={styles.infoBar}>
//                                 <View style={styles.infoIconShadow} />
//                                 <Text style={styles.infoIcon}>{emoji.star}</Text>
//                                 <Text style={styles.infoTitle}>Reviews</Text>
//                                 <Text style={styles.infoNumber}>{reviews.length}</Text>
//                             </View>
//                             <View style={styles.infoBar}>
//                                 <View style={styles.infoIconShadow} />
//                                 <Text style={styles.infoIcon}>{emoji.messages}</Text>
//                                 <Text style={styles.infoTitle}>Questions</Text>
//                                 <Text style={styles.infoNumber}>{questions.length}</Text>
//                             </View>
//                             <View style={styles.infoBar}>
//                                 <View style={styles.infoIconShadow} />
//                                 <Text style={styles.infoIcon}>{emoji.excited}</Text>
//                                 <Text style={styles.infoTitle}>Tips</Text>
//                                 <Text style={styles.infoNumber}>{tips.length}</Text>
//                             </View>
//                         </View>

//                         <Button onPress={this.addOrDeleteItemOnPress} height={65}>
//                             add to my items
//                         </Button>

//                         <View style={styles.tabBarContainer}>
//                             {tabs.map((item) => (
//                                 <TouchableOpacity
//                                     key={item.key}
//                                     style={[
//                                         styles.tabTitleContainer,
//                                         { borderBottomColor: item.focused ? colors.PRIMARY_COLOR : colors.GREY },
//                                     ]}
//                                     onPress={item.onPress}>
//                                     <Text
//                                         style={[styles.tabTitle, { color: item.focused ? colors.PRIMARY_COLOR : colors.BLACK }]}>
//                                         {item.title}
//                                     </Text>
//                                 </TouchableOpacity>
//                             ))}
//                         </View>

//                         <About product={product} show={tabs[0].focused} />
//                         <Reviews product_asin={product_asin} show={tabs[1].focused} navigation={this.props.navigation} />
//                         <Questions product_asin={product_asin} show={tabs[2].focused} navigation={this.props.navigation} />
//                         <Tips product_asin={product_asin} show={tabs[3].focused} navigation={this.props.navigation} />
//                     </TriggeringView>
//                 </ImageHeaderScrollView>
//                 <AuthDialog authDialogRef={this.authDialogRef} navigation={this.props.navigation} />
//             </View>
//         );
//     }
// }
