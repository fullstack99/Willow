import React, { useState, useEffect, useLayoutEffect } from 'react';
import { StyleSheet, Text, View, Animated, SafeAreaView, SectionList } from 'react-native';
import { useSelector } from 'react-redux';
import { colors, fonts } from '../../constants';
import GlobalStyles from '../../constants/globalStyles';
import FirebaseUser from '../../service/firebase_requests/User';
import FirebaseChat from '../../service/firebase_requests/Chat';
import FirebaseError from '../../service/firebase_errors';
import ShareUserTab from '../../components/Share/ShareUserTab';
import ShareGroupChatTab from '../../components/Share/ShareGroupChatTab';
import Toast from '../../components/Toast';

const ShareInWillow = ({ navigation, route }) => {
    const { data, author } = route.params;
    const { following } = useSelector((state) => state.auth);
    const [friends, setFriends] = useState([]);
    const [groupChats, setGroupChats] = useState([]);
    const [error, setError] = useState('');
    const [toastOpacity, setToastOpacity] = useState(new Animated.Value(0));

    useLayoutEffect(() => {
        navigation &&
            navigation.setOptions({
                title: 'share with',
            });
    }, [navigation]);

    useEffect(() => {
        const friendsUIDs = following.filter((f) => f.mutualFriend && !f.isAdmin);
        Promise.all(friendsUIDs.map((f) => FirebaseUser.getUserById(f.uid)))
            .then((results) => {
                setFriends(
                    results.map((userData) => {
                        return { ...userData, sent: false };
                    }),
                );
            })
            .catch((error) => FirebaseError.setError(error, setError));
    }, [following]);

    useEffect(() => {
        FirebaseChat.getCurrentUserNonDMChatRooms()
            .then((results) =>
                setGroupChats(
                    results.map((groupChatData) => {
                        return { ...groupChatData, sent: false };
                    }),
                ),
            )
            .catch((error) => FirebaseError.setError(error, setError));
    }, []);

    const _emptySection = ({ section }) => {
        if (section.data.length === 0) {
            return <Text style={styles.emptySectionFooter}>no {section.title}</Text>;
        } else return null;
    };

    const toggleToastMessage = () => {
        Animated.timing(toastOpacity, {
            toValue: 1,
            duration: 500,
            useNativeDriver: true,
        }).start(({ finished }) => {
            if (finished) {
                setTimeout(() => {
                    Animated.timing(toastOpacity, {
                        toValue: 0,
                        duration: 500,
                        useNativeDriver: true,
                    }).start();
                }, 1000);
            }
        });
    };

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <Animated.View style={[styles.toastContainer, { opacity: toastOpacity }]}>
                <Text style={styles.toastMessage}>shared successfully</Text>
            </Animated.View>
            <SectionList
                sections={[
                    {
                        key: 'friends',
                        title: 'friends',
                        data: friends,
                        keyExtractor: (item) => item.uid,
                        renderItem: ({ item }) => (
                            <ShareUserTab user={item} data={data} setError={setError} toggleToastMessage={toggleToastMessage} />
                        ),
                    },
                    {
                        key: 'groups',
                        title: 'group chats',
                        data: groupChats,
                        keyExtractor: (item) => item.id,
                        renderItem: ({ item }) => (
                            <ShareGroupChatTab room={item} data={data} toggleToastMessage={toggleToastMessage} />
                        ),
                    },
                ]}
                renderSectionHeader={({ section }) => <Text style={styles.sectionHeader}>{section.title}</Text>}
                renderSectionFooter={_emptySection}
                stickySectionHeadersEnabled={false}
            />
        </SafeAreaView>
    );
};

export default ShareInWillow;

const styles = StyleSheet.create({
    title: {
        fontFamily: fonts.NEWYORKLARGE_MEDIUM,
        fontSize: 30,
        paddingHorizontal: 20,
    },
    sectionHeader: {
        fontFamily: fonts.MULISH_SEMI_BOLD,
        fontSize: 13,
        color: colors.DARK_GREY,
        marginVertical: 30,
        paddingHorizontal: 20,
    },
    noNoticeTitle: {
        fontFamily: fonts.NEWYORKEXTRALARGE_MEDIUM,
        fontSize: 24,
        textAlign: 'center',
        paddingBottom: 20,
    },
    noNoticeSubtitle: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        textAlign: 'center',
        paddingHorizontal: 40,
    },
    emptySectionFooter: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        textAlign: 'center',
        fontStyle: 'italic',
    },
    toastContainer: {
        alignSelf: 'center',
        position: 'absolute',
        bottom: 20,
        zIndex: 100,
        backgroundColor: colors.DARKER_GREY,
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 20,
    },
    toastMessage: {
        fontFamily: fonts.MULISH_REGULAR,
        fontSize: 15,
        color: colors.WHITE,
    },
});
