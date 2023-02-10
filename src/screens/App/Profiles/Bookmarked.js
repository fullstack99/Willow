import React, { useState, useEffect } from 'react';
import {
    StyleSheet,
    Text,
    View,
    SafeAreaView,
    FlatList,
    TouchableOpacity,
    TouchableWithoutFeedback,
    Dimensions,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import * as DATABASE_CONSTANTS from '../../../constants/Database';
import * as NAVIGATOR_CONSTANTS from '../../../navigator/constants';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import { discardAlert } from '../../../utility';
import ShoppingBag from '../../../assets/Images/Feed/shopping_bag.svg';
import TipWhiteIcon from '../../../assets/Images/pen-white.svg';
import TipIcon from '../../../assets/Images/pen-green.svg';
import ReviewWhiteIcon from '../../../assets/Images/star-white.svg';
import ReviewIcon from '../../../assets/Images/star-green.svg';
import QuestionWhiteIcon from '../../../assets/Images/question-white.svg';
import QuestionIcon from '../../../assets/Images/question-green.svg';
import TrashIcon from '../../../assets/Images/Saved/trash.svg';
import NoBookmarksBackground from '../../../assets/Images/no_messages.png';
import User from '../../../service/firebase_requests/User';
import FirebaseErrors from '../../../service/firebase_errors';
import PostCard from '../../../components/Saved/PostCard';
import HeaderIcon from '../../../components/App/HeaderIcon';
import Toast from '../../../components/Toast';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';

const Bookmarked = ({ navigation }) => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [selected, setSelected] = useState('all');
    const [data, setData] = useState([]);
    const [selectMode, setSelectMode] = useState(false);
    const [selectedPost, setSelectedPost] = useState([]);
    const slides = [
        {
            key: 'all',
            title: 'all',
            icon: null,
        },
        {
            key: DATABASE_CONSTANTS.TIPS,
            title: 'tips',
            icon:
                selected === DATABASE_CONSTANTS.TIPS ? (
                    <TipWhiteIcon style={styles.filterIcon} />
                ) : (
                    <TipIcon style={styles.filterIcon} />
                ),
        },
        {
            key: DATABASE_CONSTANTS.REVIEWS,
            title: 'reviews',
            icon:
                selected === DATABASE_CONSTANTS.REVIEWS ? (
                    <ReviewWhiteIcon style={styles.filterIcon} />
                ) : (
                    <ReviewIcon style={styles.filterIcon} />
                ),
        },
        {
            key: DATABASE_CONSTANTS.QUESTIONS,
            title: 'questions',
            icon:
                selected === DATABASE_CONSTANTS.QUESTIONS ? (
                    <QuestionWhiteIcon style={styles.filterIcon} />
                ) : (
                    <QuestionIcon style={styles.filterIcon} />
                ),
        },
    ];

    useEffect(() => {
        navigation.setOptions({
            headerRight: () => {
                if (selectMode) {
                    return (
                        <HeaderIcon onPress={disableSelectMode} style={{ width: 60, justifyContent: 'center', marginRight: 15 }}>
                            <Text style={styles.cancel}>cancel</Text>
                        </HeaderIcon>
                    );
                } else return null;
            },
        });
    }, [navigation, selectMode]);

    useEffect(() => {
        setData([]);
        setSelectedPost([]);
        const unsubscribe = User.retrieveUsersBookmarks(
            selected,
            (querySnapshot) => {
                setData(querySnapshot.docs);
            },
            (error) => {
                console.log(error);
                FirebaseErrors.setError(error, setError);
            },
        );

        return unsubscribe;
    }, [selected]);

    const onSelectPost = (item) => {
        if (selectedPost.findIndex((p) => p.id === item.id) !== -1) {
            setSelectedPost(selectedPost.filter((p) => p.id !== item.id));
        } else {
            setSelectedPost([...selectedPost, item]);
        }
    };

    const disableSelectMode = () => {
        setSelectMode(false);
        setSelectedPost([]);
    };

    const deleteBookmarks = () => {
        return discardAlert(
            () => {
                setLoading(true);
                const deletePromises = [];
                selectedPost.forEach((sp) => {
                    sp.ref.delete && deletePromises.push(sp.ref.delete());
                });
                Promise.all(deletePromises)
                    .then(() => setSelectedPost([]))
                    .catch((error) => FirebaseErrors.setError(error, setError))
                    .finally(() => {
                        disableSelectMode();
                        setLoading(false);
                    });
            },
            'Remove Items',
            'Are you sure you want to remove these saved items?',
            'Remove',
            'Cancel',
        );
    };

    const navigateToPost = (item) => {
        if (!item || !item.type || !item.id) return;
        switch (item.type) {
            case DATABASE_CONSTANTS.TIPS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.TIPS, { tipID: item.id });
            case DATABASE_CONSTANTS.QUESTIONS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.QUESTIONS, { questionID: item.id });
            case DATABASE_CONSTANTS.REVIEWS:
                return navigation && navigation.push(NAVIGATOR_CONSTANTS.REVIEWS, { reviewID: item.id });
            default:
                return;
        }
    };

    return (
        <TouchableWithoutFeedback onPress={disableSelectMode}>
            <SafeAreaView style={GlobalStyles.container}>
                <LoadingDotsOverlay animation={loading} />
                <View style={GlobalStyles.toastErrorContainer}>
                    <Toast error={error} close={() => setError('')} />
                </View>
                <FlatList
                    showsHorizontalScrollIndicator={false}
                    horizontal={true}
                    keyExtractor={(item) => item.key}
                    style={styles.filterBarContainer}
                    data={slides}
                    renderItem={({ item }) => {
                        return (
                            <View style={styles.filterBarRow}>
                                {item.key === selected ? (
                                    <TouchableOpacity style={styles.selectedFilter} onPress={() => setSelected(item.key)}>
                                        {item.icon}
                                        <Text style={styles.selectedFilterText}>{item.title}</Text>
                                    </TouchableOpacity>
                                ) : (
                                    <TouchableOpacity style={styles.filter} onPress={() => setSelected(item.key)}>
                                        {item.icon}
                                        <Text style={styles.filterText}>{item.title}</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        );
                    }}
                />

                <FlatList
                    data={data}
                    key={selected}
                    keyExtractor={(item) => item.id}
                    ListEmptyComponent={
                        <View style={{ flexGrow: 1, alignItems: 'center' }}>
                            <FastImage
                                source={NoBookmarksBackground}
                                style={styles.emptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                            />
                            <Text>no bookmarks yet</Text>
                        </View>
                    }
                    renderItem={({ item }) => {
                        const chosen = selectedPost.findIndex((p) => p.id === item.id) !== -1;
                        return (
                            <PostCard
                                bookmarkReference={item}
                                documentReference={item.ref.parent.parent}
                                setError={setError}
                                chosen={chosen}
                                selectMode={selectMode}
                                setSelectMode={setSelectMode}
                                onSelectPost={onSelectPost}
                                navigateToPost={navigateToPost}
                            />
                        );
                    }}
                    numColumns={selected === DATABASE_CONSTANTS.QUESTIONS ? 1 : 2}
                    initialNumToRender={6}
                    contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 80, paddingTop: 20 }}
                    columnWrapperStyle={selected === DATABASE_CONSTANTS.QUESTIONS ? null : { justifyContent: 'space-around' }}
                />

                {selectMode && (
                    <TouchableOpacity style={styles.deleteButton} onPress={deleteBookmarks}>
                        <TrashIcon />
                    </TouchableOpacity>
                )}
            </SafeAreaView>
        </TouchableWithoutFeedback>
    );
};

export default Bookmarked;

const styles = StyleSheet.create({
    emptyBackground: {
        width: '100%',
        height: 300,
    },
    filterBarContainer: {
        marginVertical: 10,
        minHeight: 80,
        maxHeight: 80,
    },
    filterBarRow: {
        justifyContent: 'center',
        flexDirection: 'row',
        padding: 10,
    },
    selectedFilter: {
        backgroundColor: colors.PRIMARY_COLOR,
        borderRadius: 50,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        paddingHorizontal: 20,
        paddingVertical: 15,
        minWidth: 70,
    },
    selectedFilterText: {
        alignItems: 'center',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        color: colors.WHITE,
    },
    filter: {
        backgroundColor: colors.GREY,
        borderRadius: 50,
        paddingHorizontal: 20,
        paddingVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
        minWidth: 70,
    },
    filterText: {
        alignItems: 'center',
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 16,
        color: colors.BLACK,
    },
    filterIcon: {
        marginRight: 10,
    },
    cancel: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 15,
        color: colors.PRIMARY_COLOR,
    },
    deleteButton: {
        position: 'absolute',
        bottom: 50,
        left: Dimensions.get('window').width / 2 - 30,
        zIndex: 999,
    },
});
