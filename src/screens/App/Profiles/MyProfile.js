import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { StyleSheet, SafeAreaView, View, Text, FlatList, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { CommonActions } from '@react-navigation/native';
import { colors } from '../../../constants';
import GlobalStyles from '../../../constants/globalStyles';
import * as USER_CONSTANTS from '../../../constants/User';
import * as DATABASE_CONSTANTS from '../../../constants/Database';
import { SETTINGS, PROFILE_ADD_FRIEND, QUICK_FRIEND } from '../../../navigator/constants';
import FirebaseFeed from '../../../service/firebase_requests/Feed';
import FirebaseProduct from '../../../service/firebase_requests/Product';
import FirebaseErrors from '../../../service/firebase_errors/';
import UserInfo from '../../../components/Profile/UserInfo';
import Stat from '../../../components/Profile/Stat';
import Toast from '../../../components/Toast';
import Header from '../../../components/Profile/Header';
import SectionsBar from '../../../components/Profile/SectionsBar';
import PostCard from '../../../components/Profile/PostCard';
import EmptyBackground from '../../../assets/Images/no_messages.png';

const MyProfile = ({ navigation, user }) => {
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState(user?.role === 'admin' ? DATABASE_CONSTANTS.TIPS : DATABASE_CONSTANTS.ITEMS);
    const [data, setData] = useState(null);
    const [yPosition, setYPosition] = useState(0);
    const listRef = useRef();

    useEffect(() => {
        setData(null);
        if (user?.uid && selected) {
            switch (selected) {
                case DATABASE_CONSTANTS.ITEMS:
                    FirebaseProduct.getMyProducts()
                        .then((res) => {
                            setData(res || []);
                            listRef.current && listRef.current.scrollToOffset({ offset: yPosition });
                        })
                        .catch((error) => FirebaseErrors.setError(error, setError));
                    break;
                case DATABASE_CONSTANTS.TIPS:
                case DATABASE_CONSTANTS.REVIEWS:
                case DATABASE_CONSTANTS.QUESTIONS:
                    FirebaseFeed.getPostsByTypeAndUserID(user.uid, selected)
                        .then((res) => {
                            setData(res || []);
                            listRef.current && listRef.current.scrollToOffset({ offset: yPosition });
                        })
                        .catch((error) => FirebaseErrors.setError(error, setError));
                    break;
                default:
                    return;
            }
        }
    }, [selected, user?.uid]);

    const addUserOnPress = () => {
        navigation.navigate(PROFILE_ADD_FRIEND);
    };
    const settingsOnPress = () => {
        navigation.navigate(SETTINGS);
    };

    const qrCodeOnPress = () => {
        navigation.navigate(QUICK_FRIEND);
    };

    const onScroll = (e) => {
        setYPosition(e.nativeEvent.contentOffset.y);
    };

    const _renderEmptyComponent = () => {
        if (!data) return null;
        else {
            switch (selected) {
                case DATABASE_CONSTANTS.TIPS:
                    return (
                        <View>
                            <FastImage
                                source={EmptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: 250 }}
                            />
                            <Text style={styles.emptyMessage}>no tips yet</Text>
                        </View>
                    );
                case DATABASE_CONSTANTS.QUESTIONS:
                    return (
                        <View>
                            <FastImage
                                source={EmptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: 250 }}
                            />
                            <Text style={styles.emptyMessage}>no questions yet</Text>
                        </View>
                    );
                case DATABASE_CONSTANTS.REVIEWS:
                    return (
                        <View>
                            <FastImage
                                source={EmptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: 250 }}
                            />
                            <Text style={styles.emptyMessage}>no reviews yet</Text>
                        </View>
                    );
                case DATABASE_CONSTANTS.ITEMS:
                    return (
                        <View>
                            <FastImage
                                source={EmptyBackground}
                                resizeMode={FastImage.resizeMode.contain}
                                style={{ height: 250 }}
                            />
                            <Text style={styles.emptyMessage}>no items yet</Text>
                        </View>
                    );
                default:
                    return null;
            }
        }
    };

    if (!user) return null;

    return (
        <SafeAreaView style={GlobalStyles.container}>
            <View style={GlobalStyles.toastErrorContainer}>
                <Toast error={error} close={() => setError('')} />
            </View>
            <FlatList
                ListHeaderComponent={
                    <React.Fragment>
                        <View style={styles.avatarBackgroundContainer}>
                            <Header
                                myself
                                navigation={navigation}
                                addUserOnPress={addUserOnPress}
                                settingsOnPress={settingsOnPress}
                                qrCodeOnPress={qrCodeOnPress}
                            />
                            <View style={styles.avatarContainer}>
                                <FastImage source={{ uri: user[USER_CONSTANTS.AVATAR_URL] }} style={[styles.avatar]} />
                                <TouchableOpacity onPress={qrCodeOnPress} style={styles.QRCodeContainer}>
                                    <FontAwesome name="qrcode" size={30} color={colors.BLACK} />
                                </TouchableOpacity>
                            </View>
                        </View>
                        <UserInfo
                            navigation={navigation}
                            myself
                            user={user}
                            addUserOnPress={addUserOnPress}
                            settingsOnPress={settingsOnPress}
                            setError={setError}
                            loading={loading}
                            setLoading={setLoading}
                        />
                        <Stat navigation={navigation} user={user} setError={setError} />
                        <SectionsBar user={user} myself selected={selected} setSelected={setSelected} />
                    </React.Fragment>
                }
                ListHeaderComponentStyle={{ alignItems: 'center' }}
                ListEmptyComponent={_renderEmptyComponent()}
                ref={listRef}
                key={selected === DATABASE_CONSTANTS.QUESTIONS ? 1 : 2}
                numColumns={selected === DATABASE_CONSTANTS.QUESTIONS ? 1 : 2}
                initialNumToRender={6}
                data={data || []}
                keyExtractor={(item) => item.id}
                contentContainerStyle={{ paddingBottom: 80 }}
                columnWrapperStyle={selected === DATABASE_CONSTANTS.QUESTIONS ? null : { justifyContent: 'space-evenly' }}
                renderItem={({ item }) => <PostCard navigation={navigation} user={user} item={item} disableAvatar />}
                onScroll={onScroll}
            />
        </SafeAreaView>
    );
};

const mapStateToProps = (state) => ({
    user: state.auth.user,
});

const mapDispatchToProps = {};

MyProfile.propTypes = {
    navigation: PropTypes.object.isRequired,
};

export default connect(mapStateToProps, mapDispatchToProps)(MyProfile);

const styles = StyleSheet.create({
    avatarBackgroundContainer: {
        height: 200,
        marginHorizontal: 20,
        alignItems: 'center',
    },
    avatarContainer: {
        position: 'absolute',
        bottom: 0,
        justifyContent: 'center',
        alignItems: 'center',
    },
    avatar: {
        height: 120,
        width: 120,
        borderRadius: 120 / 2,
    },
    QRCodeContainer: {
        position: 'absolute',
        right: 0,
        bottom: 0,
        backgroundColor: colors.PRIMARY_COLOR,
        height: 40,
        width: 40,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 40 / 2,
        zIndex: 100,
    },
    emptyMessage: {
        textAlign: 'center',
    },
});
