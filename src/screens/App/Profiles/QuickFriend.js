import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, Dimensions, Platform } from 'react-native';
import { useSelector } from 'react-redux';
import branch from 'react-native-branch';
import QRCode from 'react-native-qrcode-svg';
import GlobalStyles from '../../../constants/globalStyles';
import { colors, fonts } from '../../../constants';
import LoadingDotsOverlay from '../../../components/LoadingDotsOverlay';

const QuickFriend = ({ navigation }) => {
    const [init, setInit] = useState(false);
    const [link, setLink] = useState(null);
    const user = useSelector((state) => state.auth.user);

    useEffect(() => {
        if (user?.uid) {
            branch
                .createBranchUniversalObject(user.uid, {
                    locallyIndex: true,
                    title: `Let's become friends in Willow`,
                })
                .then((branchObject) => {
                    if (branchObject) {
                        const linkProperties = {
                            feature: 'quick_friend',
                            channel: 'facebook',
                        };
                        const controlParams = {
                            $desktop_url: 'https://www.willow.app',
                            $canonical_identifier: user.uid,
                            data: {
                                id: user.uid,
                                type: 'quick_friend',
                            },
                        };
                        branchObject
                            .generateShortUrl(linkProperties, controlParams)
                            .then(({ url }) => {
                                setLink(url);
                            })
                            .finally(() => setInit(true));
                    }
                })
                .catch(console.log)
                .finally(() => setInit(true));
        } else {
            setInit(true);
        }
    }, [user?.uid]);

    if (!init) return <LoadingDotsOverlay animation />;

    if (link && user)
        return (
            <SafeAreaView style={[GlobalStyles.alignCenterContainer, styles.container]}>
                <View style={styles.titleContainer}>
                    <Text style={styles.title}>have other users scan me to automatically become friends 😊</Text>
                </View>
                <View style={styles.QRCodeContainer}>
                    <QRCode
                        value={link}
                        size={Dimensions.get('window').width * 0.7}
                        color={colors.PRIMARY_COLOR}
                        logo={{ uri: user.avatar_url }}
                        logoSize={Dimensions.get('window').width * 0.1}
                        logoBorderRadius={Platform.OS === 'ios' ? Dimensions.get('window').width * 0.1 : 0}
                        logoBackgroundColor={'#fff'}
                        logoMargin={4}
                    />
                </View>
            </SafeAreaView>
        );

    return <SafeAreaView style={[GlobalStyles.alignCenterContainer, styles.container]}></SafeAreaView>;
};

export default QuickFriend;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-evenly',
    },
    titleContainer: {
        flex: 1,
        paddingHorizontal: 40,
        justifyContent: 'center',
    },
    title: {
        fontFamily: fonts.MULISH_BOLD,
        fontSize: 20,
        textAlign: 'center',
    },
    QRCodeContainer: {
        flex: 2,
    },
});
